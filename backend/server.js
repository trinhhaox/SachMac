const express = require('express');
const cors = require('cors');
const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');
const os = require('os');
const si = require('systeminformation');

const app = express();
const PORT = 4000;

// Chỉ cho phép kết nối từ localhost để đảm bảo bảo mật
app.use(cors({
  origin: ['http://localhost:5173', 'http://127.0.0.1:5173', 'http://localhost:4000', 'http://127.0.0.1:4000'],
  credentials: true
}));

app.use(express.json());

// Biến lưu trữ kết quả quét tạm thời
let lastScanResults = [];

// Whitelist bảo vệ các thư mục nhạy cảm (không bao giờ được xóa)
const WHITELIST_PATTERNS = [
  'ms-playwright',
  'huggingface',
  'keychain',
  '1password',
  'bitwarden',
  'lastpass',
  'ssh',
  'gpg',
  'gnupg'
];

function isPathWhitelisted(targetPath) {
  const normalized = targetPath.toLowerCase();
  return WHITELIST_PATTERNS.some(pattern => normalized.includes(pattern));
}

// 1. API: Trạng thái hệ thống (RAM, CPU, Disk)
app.get('/api/system-status', (req, res) => {
  const totalMem = os.totalmem();
  const freeMem = os.freemem();
  const usedMem = totalMem - freeMem;

  // Lấy CPU load (1 phút qua)
  const cpus = os.cpus();
  const cpuModel = cpus[0].model;
  const loadAverage = os.loadavg()[0]; // 1 min load average

  // Lấy thông tin ổ đĩa bằng df -k /
  exec('df -k /', (err, stdout) => {
    if (err) {
      return res.status(500).json({ error: 'Cannot read disk space' });
    }
    const lines = stdout.trim().split('\n');
    if (lines.length < 2) {
      return res.status(500).json({ error: 'Invalid disk info' });
    }
    const parts = lines[1].split(/\s+/);
    const sizeKB = parseInt(parts[1], 10);
    const usedKB = parseInt(parts[2], 10);
    const freeKB = parseInt(parts[3], 10);

    res.json({
      cpu: {
        model: cpuModel,
        load: Math.min(Math.round((loadAverage / cpus.length) * 100), 100)
      },
      ram: {
        totalGB: (totalMem / (1024 ** 3)).toFixed(1),
        usedGB: (usedMem / (1024 ** 3)).toFixed(1),
        freeGB: (freeMem / (1024 ** 3)).toFixed(1),
        percentage: Math.round((usedMem / totalMem) * 100)
      },
      disk: {
        totalGB: (sizeKB / (1024 ** 2)).toFixed(1),
        usedGB: (usedKB / (1024 ** 2)).toFixed(1),
        freeGB: (freeKB / (1024 ** 2)).toFixed(1),
        percentage: Math.round((usedKB / sizeKB) * 100)
      }
    });
  });
});

// Helper: Phân tích cú pháp output của mo clean --dry-run
function parseCleanDryRun(output) {
  const categories = [];
  let currentCategory = null;

  const lines = output.split('\n');
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) continue;

    // Phát hiện category chính (ví dụ: ➤ User essentials)
    if (trimmed.startsWith('➤ ')) {
      const name = trimmed.substring(2).trim();
      currentCategory = {
        name,
        level: getCategoryLevel(name),
        items: []
      };
      categories.push(currentCategory);
      continue;
    }

    // Phát hiện item chi tiết (ví dụ: → User app cache · 42 items, 431.9MB dry)
    if ((trimmed.startsWith('→ ') || trimmed.startsWith('• ') || trimmed.startsWith('✓ ')) && currentCategory) {
      if (trimmed.includes('Nothing to clean') || trimmed.includes('already empty')) {
        continue;
      }
      
      const content = trimmed.substring(2).trim();
      const dotIndex = content.indexOf('·');
      if (dotIndex !== -1) {
        const title = content.substring(0, dotIndex).trim();
        const detailsPart = content.substring(dotIndex + 1).trim();
        
        const sizeMatch = detailsPart.match(/([0-9.]+\s*(?:KB|MB|GB|B))(?:\s*dry)?/i);
        const size = sizeMatch ? sizeMatch[1] : '0B';

        currentCategory.items.push({
          title,
          size,
          rawDetails: detailsPart
        });
      }
    }
  }

  return categories;
}

function getCategoryLevel(categoryName) {
  const name = categoryName.toLowerCase();
  if (name.includes('essential') || name.includes('app cache') || name.includes('browser') || name.includes('cloud')) {
    return 'safe'; 
  }
  if (name.includes('developer') || name.includes('leftover') || name.includes('application support')) {
    return 'advanced'; 
  }
  if (name.includes('virtualization') || name.includes('backup') || name.includes('large file')) {
    return 'deep'; 
  }
  return 'safe';
}

// 2. API: Quét dọn dẹp hệ thống (Dry-run)
app.get('/api/scan', (req, res) => {
  const moleCliPath = path.join(os.homedir(), '.local/bin/mo');
  
  exec(`"${moleCliPath}" clean --dry-run`, (err, stdout, stderr) => {
    const output = stdout || stderr;
    if (!output) {
      return res.status(500).json({ error: 'Failed to run scan script' });
    }

    try {
      const parsedResults = parseCleanDryRun(output);
      
      const listFile = path.join(os.homedir(), '.config/mole/clean-list.txt');
      let detailedPaths = [];
      if (fs.existsSync(listFile)) {
        const fileContent = fs.readFileSync(listFile, 'utf8');
        detailedPaths = fileContent.trim().split('\n').map(line => {
          const commentIndex = line.indexOf('#');
          if (commentIndex !== -1) {
            return line.substring(0, commentIndex).trim();
          }
          return line.trim();
        }).filter(line => line.length > 0);
      }

      lastScanResults = {
        categories: parsedResults,
        detailedPaths
      };

      res.json(parsedResults);
    } catch (parseErr) {
      res.status(500).json({ error: 'Error parsing scan results', details: parseErr.message });
    }
  });
});

// 3. API: Thực hiện dọn dẹp theo các mục được chọn
app.post('/api/clean', (req, res) => {
  const { selectedItems } = req.body;
  
  if (!selectedItems || !Array.isArray(selectedItems) || selectedItems.length === 0) {
    return res.status(400).json({ error: 'No items selected for cleaning' });
  }

  if (!lastScanResults || !lastScanResults.detailedPaths) {
    return res.status(400).json({ error: 'Please perform a scan first' });
  }

  const pathsToDelete = [];

  lastScanResults.detailedPaths.forEach(filePath => {
    let resolvedPath = filePath;
    if (filePath.startsWith('~/')) {
      resolvedPath = path.join(os.homedir(), filePath.substring(2));
    }

    if (isPathWhitelisted(resolvedPath)) {
      console.log(`Bảo mật: Whitelisted path skipped from deletion: ${resolvedPath}`);
      return;
    }

    const lowerPath = resolvedPath.toLowerCase();
    
    let matched = false;
    for (const itemTitle of selectedItems) {
      const lowerTitle = itemTitle.toLowerCase();
      
      if (lowerTitle === 'user app cache' && lowerPath.includes('/library/caches') && !lowerPath.includes('/google/chrome') && !lowerPath.includes('/microsoft')) {
        matched = true;
      } else if (lowerTitle === 'chrome cache' && lowerPath.includes('/library/caches/google/chrome')) {
        matched = true;
      } else if (lowerTitle === 'user app logs' && lowerPath.includes('/library/logs')) {
        matched = true;
      } else if (lowerTitle === 'npm cache' && (lowerPath.includes('/.npm') || lowerPath.includes('/npm-cache'))) {
        matched = true;
      } else if (lowerTitle === 'pip cache' && lowerPath.includes('/library/caches/pip')) {
        matched = true;
      } else if (lowerTitle === 'go cache' && (lowerPath.includes('/library/caches/go-build') || lowerPath.includes('/go/pkg/mod'))) {
        matched = true;
      } else if (lowerTitle === 'uv cache' && lowerPath.includes('/.cache/uv')) {
        matched = true;
      } else if (lowerTitle === 'rust cargo cache' && lowerPath.includes('/.cargo/registry')) {
        matched = true;
      } else if (lowerPath.includes(lowerTitle.replace(/\s+/g, ''))) {
        matched = true;
      }
    }

    if (matched) {
      pathsToDelete.push(resolvedPath);
    }
  });

  if (pathsToDelete.length === 0) {
    return res.json({ success: true, message: 'No matching paths found to delete' });
  }

  let successCount = 0;
  let failCount = 0;
  const errors = [];

  pathsToDelete.forEach(targetPath => {
    try {
      if (fs.existsSync(targetPath)) {
        const stats = fs.statSync(targetPath);
        if (stats.isDirectory()) {
          fs.rmSync(targetPath, { recursive: true, force: true });
        } else {
          fs.unlinkSync(targetPath);
        }
        successCount++;
      }
    } catch (e) {
      failCount++;
      errors.push({ path: targetPath, error: e.message });
    }
  });

  res.json({
    success: true,
    deletedPathsCount: successCount,
    failedPathsCount: failCount,
    errors: errors.slice(0, 10)
  });
});

// --- CÁC TÍNH NĂNG MỚI NÂNG CẤP ---

// 4. API: Lấy thông số phần cứng chi tiết (Pin & Nhiệt độ CPU)
app.get('/api/system-detail', async (req, res) => {
  try {
    const battery = await si.battery();
    const temp = await si.cpuTemperature();
    
    res.json({
      battery: {
        hasBattery: battery.hasBattery,
        cycleCount: battery.cycleCount || 0,
        isCharging: battery.isCharging,
        percent: battery.percent,
        health: battery.maxCapacity && battery.designCapacity 
                ? Math.round((battery.maxCapacity / battery.designCapacity) * 100)
                : 100
      },
      cpuTemp: {
        main: temp.main ? Math.round(temp.main) : 0,
        cores: temp.cores || []
      }
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to read system detail' });
  }
});

// 5. API: Lấy danh sách các ứng dụng đã cài đặt
app.get('/api/apps/list', (req, res) => {
  const appsDirs = ['/Applications', path.join(os.homedir(), 'Applications')];
  let apps = [];
  
  appsDirs.forEach(dir => {
    if (fs.existsSync(dir)) {
      try {
        const files = fs.readdirSync(dir);
        files.forEach(file => {
          if (file.endsWith('.app')) {
            const appPath = path.join(dir, file);
            const name = file.replace('.app', '');
            apps.push({ name, path: appPath });
          }
        });
      } catch (e) {
        console.error(`Error reading ${dir}: ${e.message}`);
      }
    }
  });
  
  res.json(apps.sort((a, b) => a.name.localeCompare(b.name)));
});

// 6. API: Quét tìm file leftovers của ứng dụng chỉ định
app.post('/api/apps/uninstall-scan', (req, res) => {
  const { appName, appPath } = req.body;
  if (!appName || !appPath) {
    return res.status(400).json({ error: 'Missing appName or appPath' });
  }

  const searchPaths = [
    path.join(os.homedir(), 'Library/Application Support'),
    path.join(os.homedir(), 'Library/Caches'),
    path.join(os.homedir(), 'Library/Preferences'),
    path.join(os.homedir(), 'Library/Logs'),
    '/Library/Application Support',
    '/Library/Caches',
    '/Library/Logs'
  ];

  const leftovers = [];
  
  // File chạy chính .app luôn nằm trong danh sách xóa
  leftovers.push({ path: appPath, type: 'Application Bundle', size: 'Directory' });

  searchPaths.forEach(parentDir => {
    if (fs.existsSync(parentDir)) {
      try {
        const files = fs.readdirSync(parentDir);
        files.forEach(file => {
          const lowerFile = file.toLowerCase();
          const lowerAppName = appName.toLowerCase();
          
          if (lowerFile.includes(lowerAppName) || (lowerAppName.length > 4 && lowerFile.includes(lowerAppName.substring(0, 4)))) {
            const fullPath = path.join(parentDir, file);
            let size = 'Directory';
            try {
              const stats = fs.statSync(fullPath);
              if (!stats.isDirectory()) {
                size = stats.size > 1024 * 1024 
                  ? `${(stats.size / (1024 * 1024)).toFixed(1)} MB` 
                  : `${(stats.size / 1024).toFixed(1)} KB`;
              }
            } catch (err) {}
            
            leftovers.push({
              path: fullPath,
              type: 'Leftover Asset',
              size
            });
          }
        });
      } catch (e) {}
    }
  });

  res.json(leftovers);
});

// 7. API: Thực thi xóa ứng dụng và leftovers
app.post('/api/apps/uninstall-run', (req, res) => {
  const { paths } = req.body;
  if (!paths || !Array.isArray(paths)) {
    return res.status(400).json({ error: 'Invalid paths' });
  }

  let successCount = 0;
  let failCount = 0;
  const errors = [];

  paths.forEach(targetPath => {
    if (isPathWhitelisted(targetPath)) {
      console.log(`Bảo mật: Whitelisted path skipped from uninstallation: ${targetPath}`);
      return;
    }

    try {
      if (fs.existsSync(targetPath)) {
        const stats = fs.statSync(targetPath);
        if (stats.isDirectory()) {
          fs.rmSync(targetPath, { recursive: true, force: true });
        } else {
          fs.unlinkSync(targetPath);
        }
        successCount++;
      }
    } catch (e) {
      failCount++;
      errors.push({ path: targetPath, error: e.message });
    }
  });

  res.json({ success: true, deletedCount: successCount, failedCount: failCount, errors });
});

// 8. API: Lấy danh sách ứng dụng khởi động cùng macOS (Launch Agents)
app.get('/api/startup/list', (req, res) => {
  const paths = [
    path.join(os.homedir(), 'Library/LaunchAgents'),
    '/Library/LaunchAgents',
    '/Library/LaunchDaemons'
  ];

  const items = [];
  const disabledDir = path.join(os.homedir(), 'disabled_launch_agents');
  if (!fs.existsSync(disabledDir)) {
    fs.mkdirSync(disabledDir, { recursive: true });
  }

  paths.forEach(dir => {
    if (fs.existsSync(dir)) {
      try {
        const files = fs.readdirSync(dir);
        files.forEach(file => {
          if (file.endsWith('.plist')) {
            const fullPath = path.join(dir, file);
            items.push({
              name: file.replace('.plist', ''),
              path: fullPath,
              enabled: true,
              originDir: dir
            });
          }
        });
      } catch (e) {}
    }
  });

  // Đọc danh sách các file đang bị vô hiệu hóa
  if (fs.existsSync(disabledDir)) {
    try {
      const files = fs.readdirSync(disabledDir);
      files.forEach(file => {
        if (file.endsWith('.plist')) {
          const fullPath = path.join(disabledDir, file);
          items.push({
            name: file.replace('.plist', ''),
            path: fullPath,
            enabled: false,
            originDir: path.join(os.homedir(), 'Library/LaunchAgents') // Fallback origin
          });
        }
      });
    } catch (e) {}
  }

  res.json(items);
});

// 9. API: Bật/tắt trạng thái ứng dụng khởi động
app.post('/api/startup/toggle', (req, res) => {
  const { name, currentPath, enabled } = req.body;
  if (!name || !currentPath) {
    return res.status(400).json({ error: 'Missing name or currentPath' });
  }

  const disabledDir = path.join(os.homedir(), 'disabled_launch_agents');
  if (!fs.existsSync(disabledDir)) {
    fs.mkdirSync(disabledDir, { recursive: true });
  }

  const fileName = `${name}.plist`;
  
  try {
    if (enabled) {
      // Đang bật -> Tắt (Di chuyển vào thư mục disabled_launch_agents)
      const targetPath = path.join(disabledDir, fileName);
      if (fs.existsSync(currentPath)) {
        fs.renameSync(currentPath, targetPath);
        return res.json({ success: true, enabled: false, newPath: targetPath });
      }
    } else {
      // Đang tắt -> Bật (Di chuyển về lại LaunchAgents)
      const targetPath = path.join(os.homedir(), 'Library/LaunchAgents', fileName);
      if (fs.existsSync(currentPath)) {
        fs.renameSync(currentPath, targetPath);
        return res.json({ success: true, enabled: true, newPath: targetPath });
      }
    }
    res.status(400).json({ error: 'Source file does not exist' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 10. API: Bản đồ phân tích dung lượng đĩa
app.get('/api/disk-map', (req, res) => {
  let targetPath = req.query.path || os.homedir();
  if (targetPath.startsWith('~/')) {
    targetPath = path.join(os.homedir(), targetPath.substring(2));
  }

  if (!fs.existsSync(targetPath)) {
    return res.status(400).json({ error: 'Path does not exist' });
  }

  // Bảo mật ranh giới
  if (!targetPath.startsWith(os.homedir()) && !targetPath.startsWith('/Applications')) {
    return res.status(403).json({ error: 'Access denied outside user directory' });
  }

  let cmd = `du -k -d 1 "${targetPath}"`;
  if (targetPath === os.homedir()) {
    cmd = `find "${targetPath}" -mindepth 1 -maxdepth 1 -not -name "Library" -not -name ".*" -exec du -sk {} +`;
  }

  exec(cmd, { timeout: 15000 }, (err, stdout, stderr) => {
    if (err && !stdout) {
      return res.status(500).json({ error: 'Failed to scan disk space' });
    }

    const items = [];
    const lines = (stdout || '').trim().split('\n');
    
    lines.forEach(line => {
      const parts = line.split(/\s+/);
      if (parts.length >= 2) {
        const sizeKB = parseInt(parts[0], 10);
        const fullPath = parts.slice(1).join(' ');
        
        if (fullPath === targetPath || path.resolve(fullPath) === path.resolve(targetPath)) {
          return;
        }

        const name = path.basename(fullPath);
        if (name.startsWith('.')) return; 

        let isDir = false;
        try {
          isDir = fs.statSync(fullPath).isDirectory();
        } catch (e) {}

        let sizeStr = '0 B';
        if (sizeKB > 1024 * 1024) sizeStr = `${(sizeKB / (1024 * 1024)).toFixed(1)} GB`;
        else if (sizeKB > 1024) sizeStr = `${(sizeKB / 1024).toFixed(1)} MB`;
        else sizeStr = `${sizeKB} KB`;

        items.push({
          name,
          path: fullPath,
          sizeKB,
          sizeStr,
          isDirectory: isDir
        });
      }
    });

    items.sort((a, b) => b.sizeKB - a.sizeKB);

    res.json({
      currentPath: targetPath,
      items: items.slice(0, 45) // Lấy top 45 file lớn nhất
    });
  });
});

// Phục vụ frontend tĩnh
app.use(express.static(path.join(__dirname, '../frontend/dist')));
app.get('*', (req, res, next) => {
  if (req.path.startsWith('/api')) {
    return next();
  }
  res.sendFile(path.join(__dirname, '../frontend/dist/index.html'));
});

app.listen(PORT, '127.0.0.1', () => {
  console.log(`SachMac Backend API Server running on http://127.0.0.1:${PORT}`);
});
