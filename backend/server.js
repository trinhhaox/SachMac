const express = require('express');
const cors = require('cors');
const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');
const os = require('os');

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
      // Bỏ các dòng check "Nothing to clean" hay "already empty"
      if (trimmed.includes('Nothing to clean') || trimmed.includes('already empty')) {
        continue;
      }
      
      const content = trimmed.substring(2).trim();
      const dotIndex = content.indexOf('·');
      if (dotIndex !== -1) {
        const title = content.substring(0, dotIndex).trim();
        const detailsPart = content.substring(dotIndex + 1).trim();
        
        // Lấy kích thước (ví dụ: 431.9MB dry)
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

// Phân loại các category theo mức độ an toàn
function getCategoryLevel(categoryName) {
  const name = categoryName.toLowerCase();
  if (name.includes('essential') || name.includes('app cache') || name.includes('browser') || name.includes('cloud')) {
    return 'safe'; // Cấp độ 1
  }
  if (name.includes('developer') || name.includes('leftover') || name.includes('application support')) {
    return 'advanced'; // Cấp độ 2
  }
  if (name.includes('virtualization') || name.includes('backup') || name.includes('large file')) {
    return 'deep'; // Cấp độ 3
  }
  return 'safe';
}

// 2. API: Quét hệ thống (Dry-run)
app.get('/api/scan', (req, res) => {
  const moleCliPath = path.join(os.homedir(), '.local/bin/mo');
  
  exec(`"${moleCliPath}" clean --dry-run`, (err, stdout, stderr) => {
    // mo clean --dry-run trả về 0 nếu thành công. 
    // Chúng ta parse stdout bất kể có lỗi hay không nếu có dữ liệu.
    const output = stdout || stderr;
    if (!output) {
      return res.status(500).json({ error: 'Failed to run scan script' });
    }

    try {
      const parsedResults = parseCleanDryRun(output);
      
      // Đọc file danh sách chi tiết các file rác mà Mole xuất ra
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

      // Lưu lại kết quả quét để phục vụ cho lệnh xóa sau này
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
  const { selectedItems } = req.body; // Mảng các tiêu đề của item được chọn (ví dụ: ["User app cache", "Chrome cache"])
  
  if (!selectedItems || !Array.isArray(selectedItems) || selectedItems.length === 0) {
    return res.status(400).json({ error: 'No items selected for cleaning' });
  }

  if (!lastScanResults || !lastScanResults.detailedPaths) {
    return res.status(400).json({ error: 'Please perform a scan first' });
  }

  const pathsToDelete = [];

  // Duyệt qua danh sách file chi tiết từ file clean-list.txt để lọc ra các đường dẫn thuộc các item được chọn
  lastScanResults.detailedPaths.forEach(filePath => {
    // Giải quyết dấu ngã (~) thành thư mục nhà
    let resolvedPath = filePath;
    if (filePath.startsWith('~/')) {
      resolvedPath = path.join(os.homedir(), filePath.substring(2));
    }

    // Bảo mật: kiểm tra xem đường dẫn có nằm trong whitelist bảo vệ không
    if (isPathWhitelisted(resolvedPath)) {
      console.log(`Bảo mật: Whitelisted path skipped from deletion: ${resolvedPath}`);
      return;
    }

    // Phân loại: Kiểm tra xem tệp tin này thuộc category/item nào được chọn
    // Ví dụ: file trong ~/Library/Caches/Google/Chrome thuộc "Chrome cache"
    const lowerPath = resolvedPath.toLowerCase();
    
    let matched = false;
    for (const itemTitle of selectedItems) {
      const lowerTitle = itemTitle.toLowerCase();
      
      // Logic mapping đơn giản từ tiêu đề sang đường dẫn
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
        // Fallback: so khớp chuỗi tiêu đề không khoảng trắng vào đường dẫn
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

  // Thực hiện xóa an toàn
  let successCount = 0;
  let failCount = 0;
  const errors = [];

  pathsToDelete.forEach(targetPath => {
    try {
      if (fs.existsSync(targetPath)) {
        const stats = fs.statSync(targetPath);
        if (stats.isDirectory()) {
          // Xóa đệ quy thư mục
          fs.rmSync(targetPath, { recursive: true, force: true });
        } else {
          // Xóa file đơn lẻ
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
    errors: errors.slice(0, 10) // Chỉ trả về tối đa 10 lỗi để tránh payload quá lớn
  });
});

// Phục vụ các file tĩnh của React frontend (sau khi build)
app.use(express.static(path.join(__dirname, '../frontend/dist')));
app.get('*', (req, res, next) => {
  // Chỉ phục vụ frontend cho các route không phải API
  if (req.path.startsWith('/api')) {
    return next();
  }
  res.sendFile(path.join(__dirname, '../frontend/dist/index.html'));
});

app.listen(PORT, '127.0.0.1', () => {
  console.log(`SachMac Backend API Server running on http://127.0.0.1:${PORT}`);
});
