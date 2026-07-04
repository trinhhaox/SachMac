import React, { useState, useEffect } from 'react';

const TRANSLATIONS = {
  vi: {
    dashboard: "Dashboard",
    clean: "Dọn dẹp",
    uninstaller: "Gỡ ứng dụng",
    startup: "Khởi động",
    diskMap: "Phân tích đĩa",
    about: "Giới thiệu",
    systemOverview: "Tổng quan Hệ thống",
    performanceSubtitle: "Giám sát và kiểm tra hiệu năng thời gian thực",
    cpu: "Vi xử lý CPU",
    ram: "Bộ nhớ RAM",
    disk: "Lưu trữ Ổ đĩa",
    loadingSystem: "Đang tải thông số hệ thống...",
    wantToClean: "Bạn muốn dọn dẹp và giải phóng ổ đĩa?",
    cleanDescription: "Chuyển sang mục Dọn dẹp để quét và xóa các file rác một cách an toàn và chuyên sâu.",
    goToClean: "Đi tới Dọn dẹp",
    cleanTitle: "Dọn dẹp Máy tính",
    cleanSubtitle: "Chọn cấp độ dọn dẹp và quét dọn các file rác an toàn",
    chooseLevel: "Chọn cấp độ dọn dẹp:",
    safeLevel: "Cấp độ 1: An toàn",
    safeDesc: "Chỉ dọn dẹp Thùng rác, cache ứng dụng thường và cache trình duyệt. Rất an toàn, khuyên dùng chạy hàng ngày.",
    advancedLevel: "Cấp độ 2: Nâng cao",
    advancedDesc: "Bao gồm Cấp độ 1 và bổ sung thêm dọn dẹp cache các công cụ lập trình (npm, pip, go...), file cấu hình mồ côi (leftovers).",
    deepLevel: "Cấp độ 3: Quét sâu",
    deepDesc: "Bao gồm Cấp độ 2 và bổ sung dọn dẹp sâu Xcode, Docker unused data và caches hệ thống sâu. Cần quyền admin.",
    startScan: "Bắt đầu quét hệ thống",
    scanning: "Đang quét hệ thống bằng Mole CLI. Vui lòng đợi...",
    freeableSpace: "Dung lượng có thể giải phóng:",
    currentLevel: "Cấp độ quét hiện tại:",
    back: "Quay lại",
    cleanNow: "Dọn dẹp ngay",
    cleaning: "Đang thực hiện xóa các tệp rác an toàn. Vui lòng đợi...",
    cleanSuccess: "Dọn dẹp hoàn tất thành công!",
    cleanSuccessDesc: "Đã giải phóng thành công các thư mục rác hệ thống.",
    deletedCount: "Đã xóa thành công {count} thư mục/tệp tin rác.",
    failedPaths: "Có {count} thư mục không thể xóa (do tệp tin đang mở hoặc quyền ghi).",
    aboutTitle: "🐹 Ứng dụng SachMac GUI",
    aboutDesc: "SachMac là một ứng dụng giao diện trực quan hỗ trợ dọn dẹp hệ thống macOS. Ứng dụng hoạt động dựa trên sự kết hợp của backend API tối ưu và nhân quét đĩa cao tốc Mole CLI viết bằng Go.",
    features: "Tính năng chính:",
    feature1: "Phân chia dọn dẹp theo 3 cấp độ (An toàn, Nâng cao, Quét sâu).",
    feature2: "Hệ thống bảo vệ whitelist ngăn chặn việc vô tình xóa các tệp tin cấu hình bảo mật hoặc khóa SSH.",
    feature3: "API local bảo mật 100%, không gửi dữ liệu ra bên ngoài.",
    feature4: "Giao diện thiết kế theo phong cách Apple Premium UI.",
    version: "Phiên bản:",
    running: "đang tải",
    free: "Còn trống",
    language: "Ngôn ngữ",
    selectItems: "Vui lòng chọn ít nhất một mục để dọn dẹp.",
    connectionError: "Không thể kết nối tới Backend API. Vui lòng đảm bảo server đang chạy.",
    
    // Uninstaller
    uninstallerTitle: "Gỡ ứng dụng tận gốc",
    uninstallerSubtitle: "Quét và gỡ bỏ hoàn toàn file rác mồ côi (leftovers) của ứng dụng",
    scanLeftovers: "Đang quét file leftovers cho ứng dụng {name}...",
    leftoversTitle: "Danh sách file leftovers phát hiện cho {name}",
    uninstallBtn: "Gỡ bỏ app & leftovers",
    noApps: "Không tìm thấy ứng dụng nào cài đặt.",
    searchApp: "Tìm kiếm ứng dụng...",
    uninstalling: "Đang tiến hành gỡ cài đặt ứng dụng. Vui lòng đợi...",
    uninstallSuccess: "Gỡ cài đặt hoàn tất thành công!",
    uninstallSuccessDesc: "Đã xóa thành công {count} tệp tin và giải phóng hoàn toàn ứng dụng.",
    
    // Startup
    startupTitle: "Quản lý Ứng dụng Khởi động",
    startupSubtitle: "Quản lý Launch Agents để máy Mac khởi động nhanh hơn",
    startupName: "Tên dịch vụ khởi động",
    status: "Trạng thái",
    enabled: "Kích hoạt",
    disabled: "Vô hiệu hóa",
    loadingStartup: "Đang tải các tác vụ khởi động...",
    noStartup: "Không phát hiện Launch Agents/Daemons nào.",
    
    // Disk Map
    diskMapTitle: "Phân tích Ổ đĩa",
    diskMapSubtitle: "Quét dung lượng các thư mục con và tìm các file cực lớn",
    currentPath: "Thư mục hiện tại:",
    upFolder: "Thư mục cha",
    selectFolder: "Chọn thư mục",
    scanningDisk: "Đang quét phân tích dung lượng ổ đĩa. Vui lòng đợi...",
    itemName: "Tên tệp/thư mục",
    size: "Dung lượng",
    action: "Hành động",
    delete: "Xóa",
    confirmDelete: "Bạn có chắc chắn muốn xóa vĩnh viễn: {name}?",
    
    // Hardware HUD
    cpuTemp: "Nhiệt độ CPU",
    battery: "Sức khỏe Pin",
    cycleCount: "Số chu kỳ sạc:",
    health: "Sức khỏe Pin:"
  },
  en: {
    dashboard: "Dashboard",
    clean: "Clean",
    uninstaller: "Uninstaller",
    startup: "Startup Manager",
    diskMap: "Disk Map",
    about: "About",
    systemOverview: "System Overview",
    performanceSubtitle: "Real-time performance monitoring and checking",
    cpu: "CPU Processor",
    ram: "RAM Memory",
    disk: "Disk Storage",
    loadingSystem: "Loading system parameters...",
    wantToClean: "Want to clean and free up disk space?",
    cleanDescription: "Switch to the Clean section to scan and delete junk files safely and deeply.",
    goToClean: "Go to Clean",
    cleanTitle: "Clean Computer",
    cleanSubtitle: "Select clean level and scan junk files safely",
    chooseLevel: "Select clean level:",
    safeLevel: "Level 1: Safe",
    safeDesc: "Clean Trash, app caches, and browser cache only. 100% safe, recommended for daily runs.",
    advancedLevel: "Level 2: Advanced",
    advancedDesc: "Includes Level 1 plus cleaning developer tools cache (npm, pip, go...) and orphan config files (leftovers).",
    deepLevel: "Level 3: Deep Clean",
    deepDesc: "Includes Level 2 plus deep cleaning of Xcode, Docker unused data, and deep system caches. Requires admin permission.",
    startScan: "Start system scan",
    scanning: "Scanning system with Mole CLI. Please wait...",
    freeableSpace: "Space that can be freed:",
    currentLevel: "Current scan level:",
    back: "Back",
    cleanNow: "Clean Now",
    cleaning: "Deleting safe junk files. Please wait...",
    cleanSuccess: "Cleaning completed successfully!",
    cleanSuccessDesc: "Successfully released system junk directories.",
    deletedCount: "Successfully deleted {count} junk directories/files.",
    failedPaths: "There are {count} directories that could not be deleted (due to open files or permission issues).",
    aboutTitle: "🐹 SachMac GUI App",
    aboutDesc: "SachMac is a visual interface application for macOS cleaning. It works based on a combination of optimized backend API and high-speed Go-based Mole CLI core.",
    features: "Key Features:",
    feature1: "Divide cleaning into 3 levels (Safe, Advanced, Deep Clean).",
    feature2: "Whitelist protection system prevents accidental deletion of security files or SSH keys.",
    feature3: "100% secure local API, does not send data outside.",
    feature4: "Interface designed in Apple Premium UI style.",
    version: "Version:",
    running: "loading",
    free: "Free",
    language: "Language",
    selectItems: "Please select at least one item to clean.",
    connectionError: "Could not connect to Backend API. Please make sure the server is running.",
    
    // Uninstaller
    uninstallerTitle: "App Uninstaller",
    uninstallerSubtitle: "Scan and completely remove application leftovers and cache assets",
    scanLeftovers: "Scanning leftovers for application {name}...",
    leftoversTitle: "Detected leftover assets for {name}",
    uninstallBtn: "Remove App & Leftovers",
    noApps: "No installed applications found.",
    searchApp: "Search applications...",
    uninstalling: "Uninstalling app assets. Please wait...",
    uninstallSuccess: "Uninstallation completed successfully!",
    uninstallSuccessDesc: "Successfully deleted {count} files and completely uninstalled the application.",
    
    // Startup
    startupTitle: "Startup Manager",
    startupSubtitle: "Manage Launch Agents to make macOS boot faster",
    startupName: "Startup Service Name",
    status: "Status",
    enabled: "Enabled",
    disabled: "Disabled",
    loadingStartup: "Loading startup tasks...",
    noStartup: "No Launch Agents/Daemons detected.",
    
    // Disk Map
    diskMapTitle: "Disk Analyzer Map",
    diskMapSubtitle: "Scan subdirectory sizes and identify large files",
    currentPath: "Current Directory:",
    upFolder: "Up Folder",
    selectFolder: "Select Folder",
    scanningDisk: "Scanning disk directories. Please wait...",
    itemName: "File/Folder Name",
    size: "Size",
    action: "Action",
    delete: "Delete",
    confirmDelete: "Are you sure you want to permanently delete: {name}?",
    
    // Hardware HUD
    cpuTemp: "CPU Temperature",
    battery: "Battery Health",
    cycleCount: "Charge Cycles:",
    health: "Battery Condition:"
  }
};

const formatPath = (p) => {
  if (!p) return '';
  return p.replace(/^\/Users\/[^\/]+/, '~');
};

const isHomeDirectory = (p) => {
  if (!p) return true;
  return /^\/Users\/[^\/]+\/?$/.test(p) || p === '/';
};

function App() {
  const [lang, setLang] = useState(() => localStorage.getItem('sachmac_lang') || 'vi');
  const [activeTab, setActiveTab] = useState('dashboard');
  
  // States: Dọn dẹp
  const [cleanLevel, setCleanLevel] = useState('safe');
  const [scanStatus, setScanStatus] = useState('idle'); 
  const [scanResults, setScanResults] = useState([]);
  const [selectedItems, setSelectedItems] = useState({});
  const [cleanSummary, setCleanSummary] = useState(null);

  // States: Hệ thống
  const [systemStatus, setSystemStatus] = useState(null);
  const [hardwareDetail, setHardwareDetail] = useState(null);

  // States: Uninstaller
  const [appsList, setAppsList] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedApp, setSelectedApp] = useState(null);
  const [uninstallerStatus, setUninstallerStatus] = useState('idle'); // idle | scanning | scanned | cleaning | cleaned
  const [leftovers, setLeftovers] = useState([]);
  const [selectedLeftovers, setSelectedLeftovers] = useState({});
  const [uninstallSummary, setUninstallSummary] = useState(null);

  // States: Startup Manager
  const [startupItems, setStartupItems] = useState([]);
  const [startupLoading, setStartupLoading] = useState(false);

  // States: Disk Map
  const [diskMapData, setDiskMapData] = useState(null);
  const [diskMapPath, setDiskMapPath] = useState('~/');
  const [diskMapLoading, setDiskMapLoading] = useState(false);

  const t = (key, replaceObj = {}) => {
    let text = TRANSLATIONS[lang][key] || TRANSLATIONS['vi'][key] || key;
    Object.keys(replaceObj).forEach(k => {
      text = text.replace(`{${k}}`, replaceObj[k]);
    });
    return text;
  };

  const changeLanguage = (newLang) => {
    setLang(newLang);
    localStorage.setItem('sachmac_lang', newLang);
  };

  // Fetch trạng thái hệ thống và phần cứng định kỳ
  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const res = await fetch('http://127.0.0.1:4000/api/system-status');
        const data = await res.json();
        setSystemStatus(data);
      } catch (err) {
        console.error(err);
      }
    };

    const fetchHardware = async () => {
      try {
        const res = await fetch('http://127.0.0.1:4000/api/system-detail');
        const data = await res.json();
        setHardwareDetail(data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchStatus();
    fetchHardware();
    const interval = setInterval(() => {
      fetchStatus();
      fetchHardware();
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  // API Uninstaller: Lấy danh sách app
  const fetchApps = async () => {
    try {
      const res = await fetch('http://127.0.0.1:4000/api/apps/list');
      const data = await res.json();
      setAppsList(data);
    } catch (err) {
      console.error(err);
    }
  };

  // API Startup: Lấy danh sách Launch Agents
  const fetchStartupItems = async () => {
    setStartupLoading(true);
    try {
      const res = await fetch('http://127.0.0.1:4000/api/startup/list');
      const data = await res.json();
      setStartupItems(data);
    } catch (err) {
      console.error(err);
    } finally {
      setStartupLoading(false);
    }
  };

  // API Disk Map: Quét phân tích ổ đĩa
  const fetchDiskMap = async (dirPath) => {
    setDiskMapLoading(true);
    try {
      const res = await fetch(`http://127.0.0.1:4000/api/disk-map?path=${encodeURIComponent(dirPath)}`);
      const data = await res.json();
      setDiskMapData(data);
      setDiskMapPath(data.currentPath);
    } catch (err) {
      console.error(err);
    } finally {
      setDiskMapLoading(false);
    }
  };

  // Trigger khi đổi Tab
  useEffect(() => {
    if (activeTab === 'uninstaller') {
      fetchApps();
      setUninstallerStatus('idle');
    } else if (activeTab === 'startup') {
      fetchStartupItems();
    } else if (activeTab === 'diskMap') {
      fetchDiskMap(diskMapPath);
    }
  }, [activeTab]);

  // Quét Clean
  const handleScan = async () => {
    setScanStatus('scanning');
    try {
      const res = await fetch('http://127.0.0.1:4000/api/scan');
      const data = await res.json();
      setScanResults(data);
      setScanStatus('scanned');
      const initialSelection = {};
      data.forEach(cat => {
        cat.items.forEach(item => { initialSelection[item.title] = true; });
      });
      setSelectedItems(initialSelection);
    } catch (err) {
      setScanStatus('idle');
      alert(t('connectionError'));
    }
  };

  // Xóa Clean
  const handleClean = async () => {
    const itemsToClean = Object.keys(selectedItems).filter(key => selectedItems[key]);
    if (itemsToClean.length === 0) {
      alert(t('selectItems'));
      return;
    }
    setScanStatus('cleaning');
    try {
      const res = await fetch('http://127.0.0.1:4000/api/clean', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ selectedItems: itemsToClean })
      });
      const data = await res.json();
      setCleanSummary(data);
      setScanStatus('cleaned');
    } catch (err) {
      setScanStatus('scanned');
    }
  };

  // Quét Uninstaller Leftovers
  const handleScanAppLeftovers = async (app) => {
    setSelectedApp(app);
    setUninstallerStatus('scanning');
    try {
      const res = await fetch('http://127.0.0.1:4000/api/apps/uninstall-scan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ appName: app.name, appPath: app.path })
      });
      const data = await res.json();
      setLeftovers(data);
      setUninstallerStatus('scanned');
      const initialSelection = {};
      data.forEach(item => { initialSelection[item.path] = true; });
      setSelectedLeftovers(initialSelection);
    } catch (err) {
      setUninstallerStatus('idle');
    }
  };

  // Thực thi Uninstaller
  const handleUninstallRun = async () => {
    const pathsToDelete = Object.keys(selectedLeftovers).filter(k => selectedLeftovers[k]);
    if (pathsToDelete.length === 0) return;
    setUninstallerStatus('cleaning');
    try {
      const res = await fetch('http://127.0.0.1:4000/api/apps/uninstall-run', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ paths: pathsToDelete })
      });
      const data = await res.json();
      setUninstallSummary(data);
      setUninstallerStatus('cleaned');
      fetchApps();
    } catch (err) {
      setUninstallerStatus('scanned');
    }
  };

  // Toggle Startup Items
  const handleToggleStartup = async (item) => {
    try {
      const res = await fetch('http://127.0.0.1:4000/api/startup/toggle', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: item.name, currentPath: item.path, enabled: item.enabled })
      });
      if (res.ok) {
        fetchStartupItems();
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Xóa tệp tin lớn trong Disk Map
  const handleDeleteLargeFile = async (itemPath, itemName) => {
    if (confirm(t('confirmDelete', { name: itemName }))) {
      try {
        const res = await fetch('http://127.0.0.1:4000/api/clean', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ selectedItems: [itemName] }) 
        });
        // Thực thi xóa file đơn giản bằng cách gửi path đến endpoint xóa leftovers
        await fetch('http://127.0.0.1:4000/api/apps/uninstall-run', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ paths: [itemPath] })
        });
        fetchDiskMap(diskMapPath);
      } catch (err) {
        console.error(err);
      }
    }
  };

  // Điều hướng lên thư mục cha
  const handleGoUp = () => {
    const parts = diskMapPath.split('/');
    if (parts.length > 2) {
      parts.pop();
      const parent = parts.join('/');
      fetchDiskMap(parent);
    }
  };

  // Chọn thư mục để phân tích
  const handleSelectFolder = async () => {
    try {
      const res = await fetch('http://127.0.0.1:4000/api/select-folder', {
        method: 'POST'
      });
      if (res.ok) {
        const data = await res.json();
        if (data.path) {
          fetchDiskMap(data.path);
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="app-container">
      {/* Sidebar */}
      <div className="sidebar">
        <div>
          <div className="brand-section">
            <span className="brand-logo">🐹</span>
            <span className="brand-name">SachMac</span>
          </div>

          <ul className="nav-menu">
            <li className={`nav-item ${activeTab === 'dashboard' ? 'active' : ''}`} onClick={() => setActiveTab('dashboard')}>
              <span className="nav-icon">📊</span> {t('dashboard')}
            </li>
            <li className={`nav-item ${activeTab === 'clean' ? 'active' : ''}`} onClick={() => setActiveTab('clean')}>
              <span className="nav-icon">🧹</span> {t('clean')}
            </li>
            <li className={`nav-item ${activeTab === 'uninstaller' ? 'active' : ''}`} onClick={() => setActiveTab('uninstaller')}>
              <span className="nav-icon">📦</span> {t('uninstaller')}
            </li>
            <li className={`nav-item ${activeTab === 'startup' ? 'active' : ''}`} onClick={() => setActiveTab('startup')}>
              <span className="nav-icon">⚡</span> {t('startup')}
            </li>
            <li className={`nav-item ${activeTab === 'diskMap' ? 'active' : ''}`} onClick={() => setActiveTab('diskMap')}>
              <span className="nav-icon">💾</span> {t('diskMap')}
            </li>
            <li className={`nav-item ${activeTab === 'about' ? 'active' : ''}`} onClick={() => setActiveTab('about')}>
              <span className="nav-icon">ℹ️</span> {t('about')}
            </li>
          </ul>
        </div>

        {/* Ngôn ngữ và HUD hệ thống */}
        <div>
          <div style={{ display: 'flex', gap: '8px', padding: '10px 14px', marginBottom: '14px', alignItems: 'center' }}>
            <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>🌐</span>
            <button onClick={() => changeLanguage('vi')} style={{ background: lang === 'vi' ? 'rgba(0, 122, 255, 0.2)' : 'transparent', border: 'none', color: lang === 'vi' ? '#fff' : 'var(--text-secondary)', fontWeight: lang === 'vi' ? 'bold' : 'normal', padding: '2px 8px', borderRadius: '4px', cursor: 'pointer', fontSize: '12px' }}>VI</button>
            <button onClick={() => changeLanguage('en')} style={{ background: lang === 'en' ? 'rgba(0, 122, 255, 0.2)' : 'transparent', border: 'none', color: lang === 'en' ? '#fff' : 'var(--text-secondary)', fontWeight: lang === 'en' ? 'bold' : 'normal', padding: '2px 8px', borderRadius: '4px', cursor: 'pointer', fontSize: '12px' }}>EN</button>
          </div>

          {systemStatus && (
            <div className="system-status-sidebar">
              <div className="status-row"><span className="status-label">CPU</span><span className="status-value">{systemStatus.cpu.load}%</span></div>
              <div className="status-row"><span className="status-label">RAM</span><span className="status-value">{systemStatus.ram.percentage}%</span></div>
              <div className="status-row"><span className="status-label">Disk</span><span className="status-value">{systemStatus.disk.percentage}%</span></div>
            </div>
          )}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="main-content">
        
        {/* TAB 1: DASHBOARD */}
        {activeTab === 'dashboard' && (
          <>
            <div className="page-header">
              <div>
                <h1 className="page-title">{t('systemOverview')}</h1>
                <p className="page-subtitle">{t('performanceSubtitle')}</p>
              </div>
            </div>

            {systemStatus ? (
              <div className="dashboard-grid">
                <div className="card">
                  <div className="card-header"><span className="card-title">{t('cpu')}</span><span className="card-icon">⚙️</span></div>
                  <div className="card-body">
                    <h2>{systemStatus.cpu.load}% <span style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>{t('running')}</span></h2>
                    <div className="progress-bar-container">
                      <div className={`progress-bar ${systemStatus.cpu.load > 80 ? 'yellow' : 'blue'}`} style={{ width: `${systemStatus.cpu.load}%` }}></div>
                    </div>
                    <div className="card-detail" style={{ marginTop: '10px' }}>
                      <span>Model: {systemStatus.cpu.model.split('@')[0]}</span>
                      {hardwareDetail && <span>🔥 {hardwareDetail.cpuTemp.main}°C</span>}
                    </div>
                  </div>
                </div>

                <div className="card">
                  <div className="card-header"><span className="card-title">{t('ram')}</span><span className="card-icon">🧠</span></div>
                  <div className="card-body">
                    <h2>{systemStatus.ram.usedGB} GB <span style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>/ {systemStatus.ram.totalGB} GB ({systemStatus.ram.percentage}%)</span></h2>
                    <div className="progress-bar-container">
                      <div className={`progress-bar ${systemStatus.ram.percentage > 85 ? 'yellow' : 'green'}`} style={{ width: `${systemStatus.ram.percentage}%` }}></div>
                    </div>
                    <div className="card-detail" style={{ marginTop: '10px' }}>
                      <span>{t('free')}: {systemStatus.ram.freeGB} GB</span>
                    </div>
                  </div>
                </div>

                <div className="card">
                  <div className="card-header"><span className="card-title">{t('disk')}</span><span className="card-icon">💾</span></div>
                  <div className="card-body">
                    <h2>{systemStatus.disk.usedGB} GB <span style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>/ {systemStatus.disk.totalGB} GB ({systemStatus.disk.percentage}%)</span></h2>
                    <div className="progress-bar-container">
                      <div className={`progress-bar ${systemStatus.disk.percentage > 90 ? 'yellow' : 'blue'}`} style={{ width: `${systemStatus.disk.percentage}%` }}></div>
                    </div>
                    <div className="card-detail" style={{ marginTop: '10px' }}>
                      <span>{t('free')}: {systemStatus.disk.freeGB} GB</span>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="scanning-hud"><div className="spinner"></div><p>{t('loadingSystem')}</p></div>
            )}

            {/* Hardware HUD - Pin */}
            {hardwareDetail && hardwareDetail.battery.hasBattery && (
              <div className="card">
                <div className="card-header"><span className="card-title">{t('battery')}</span><span className="card-icon">🔋</span></div>
                <div className="card-body" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                  <div>
                    <h2>{hardwareDetail.battery.percent}% <span style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>{hardwareDetail.battery.isCharging ? 'Charging' : 'Battery'}</span></h2>
                    <div className="progress-bar-container" style={{ marginTop: '8px' }}>
                      <div className="progress-bar green" style={{ width: `${hardwareDetail.battery.percent}%` }}></div>
                    </div>
                  </div>
                  <div style={{ fontSize: '14px', display: 'flex', flexDirection: 'column', gap: '4px', justifyContent: 'center' }}>
                    <div><strong>{t('health')}</strong> {hardwareDetail.battery.health}%</div>
                    <div><strong>{t('cycleCount')}</strong> {hardwareDetail.battery.cycleCount}</div>
                  </div>
                </div>
              </div>
            )}
          </>
        )}

        {/* TAB 2: CLEAN */}
        {activeTab === 'clean' && (
          <>
            <div className="page-header">
              <div>
                <h1 className="page-title">{t('cleanTitle')}</h1>
                <p className="page-subtitle">{t('cleanSubtitle')}</p>
              </div>
            </div>

            {scanStatus === 'idle' && (
              <div>
                <h3>{t('chooseLevel')}</h3>
                <div className="clean-level-grid">
                  <div className={`level-card safe ${cleanLevel === 'safe' ? 'active' : ''}`} onClick={() => setCleanLevel('safe')}>
                    <div className="level-header"><span className="level-title">{t('safeLevel')}</span><span className="level-badge safe">Safe</span></div>
                    <p className="level-desc">{t('safeDesc')}</p>
                  </div>
                  <div className={`level-card advanced ${cleanLevel === 'advanced' ? 'active' : ''}`} onClick={() => setCleanLevel('advanced')}>
                    <div className="level-header"><span className="level-title">{t('advancedLevel')}</span><span className="level-badge advanced">Advanced</span></div>
                    <p className="level-desc">{t('advancedDesc')}</p>
                  </div>
                  <div className={`level-card deep ${cleanLevel === 'deep' ? 'active' : ''}`} onClick={() => setCleanLevel('deep')}>
                    <div className="level-header"><span className="level-title">{t('deepLevel')}</span><span className="level-badge deep">Deep</span></div>
                    <p className="level-desc">{t('deepDesc')}</p>
                  </div>
                </div>
                <div className="actions-section"><button className="btn btn-primary" onClick={handleScan}>{t('startScan')}</button></div>
              </div>
            )}

            {scanStatus === 'scanning' && (
              <div className="scanning-hud"><div className="spinner"></div><p>{t('scanning')}</p></div>
            )}

            {scanStatus === 'scanned' && (
              <div className="results-container">
                <div className="results-header">
                  <div>
                    <h2 className="results-title">{t('freeableSpace')} <span style={{ color: 'var(--accent-green)' }}>{getTotalTrashSize()}</span></h2>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '13px', marginTop: '4px' }}>{t('currentLevel')} <strong>{cleanLevel}</strong></p>
                  </div>
                  <div style={{ display: 'flex', gap: '12px' }}>
                    <button className="btn btn-secondary" onClick={() => setScanStatus('idle')}>{t('back')}</button>
                    <button className="btn btn-primary" onClick={handleClean}>{t('cleanNow')}</button>
                  </div>
                </div>
                <div className="results-list">
                  {getFilteredResults().map((cat, idx) => (
                    <div key={idx} style={{ marginBottom: '16px' }}>
                      <h4 style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', fontSize: '15px' }}>
                        <span>📂</span> {cat.name}
                        <span className={`level-badge ${cat.level}`} style={{ fontSize: '8px' }}>{cat.level}</span>
                      </h4>
                      {cat.items.map((item, itemIdx) => (
                        <div key={itemIdx} className="result-item">
                          <div className="item-left">
                            <input type="checkbox" className="checkbox-custom" checked={!!selectedItems[item.title]} onChange={() => handleToggleItem(item.title)} />
                            <span className="item-name">{item.title}</span>
                          </div>
                          <span className="item-size">{item.size}</span>
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {scanStatus === 'cleaning' && (
              <div className="scanning-hud"><div className="spinner" style={{ borderTopColor: 'var(--accent-green)' }}></div><p>{t('cleaning')}</p></div>
            )}

            {scanStatus === 'cleaned' && cleanSummary && (
              <div className="card" style={{ border: '1px solid var(--accent-green)', backgroundColor: 'rgba(52, 199, 89, 0.03)', textAlign: 'center', padding: '40px', gap: '20px' }}>
                <span style={{ fontSize: '64px' }}>🎉</span>
                <h2>{t('cleanSuccess')}</h2>
                <p style={{ color: 'var(--text-secondary)' }}>{t('cleanSuccessDesc')} {t('deletedCount', { count: cleanSummary.deletedPathsCount })}</p>
                <button className="btn btn-primary" style={{ alignSelf: 'center' }} onClick={() => setScanStatus('idle')}>{t('back')}</button>
              </div>
            )}
          </>
        )}

        {/* TAB 3: UNINSTALLER */}
        {activeTab === 'uninstaller' && (
          <>
            <div className="page-header">
              <div>
                <h1 className="page-title">{t('uninstallerTitle')}</h1>
                <p className="page-subtitle">{t('uninstallerSubtitle')}</p>
              </div>
            </div>

            {uninstallerStatus === 'idle' && (
              <div className="card">
                <input 
                  type="text" 
                  placeholder={t('searchApp')} 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    borderRadius: '10px',
                    border: '1px solid var(--border-color)',
                    backgroundColor: 'rgba(255, 255, 255, 0.03)',
                    color: '#fff',
                    fontFamily: 'inherit',
                    fontSize: '15px'
                  }}
                />
                
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px', marginTop: '16px', maxHeight: '420px', overflowY: 'auto' }}>
                  {appsList.filter(app => app.name.toLowerCase().includes(searchQuery.toLowerCase())).map((app, idx) => (
                    <div 
                      key={idx} 
                      onClick={() => handleScanAppLeftovers(app)}
                      style={{
                        padding: '16px',
                        borderRadius: '12px',
                        border: '1px solid var(--border-color)',
                        backgroundColor: 'rgba(255, 255, 255, 0.02)',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                        transition: 'all 0.2s ease'
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.06)'}
                      onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.02)'}
                    >
                      <span style={{ fontSize: '24px' }}>💻</span>
                      <div style={{ overflow: 'hidden' }}>
                        <div style={{ fontWeight: 600, textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>{app.name}</div>
                        <div style={{ fontSize: '11px', color: 'var(--text-secondary)', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>{app.path}</div>
                      </div>
                    </div>
                  ))}
                  {appsList.length === 0 && <p>{t('noApps')}</p>}
                </div>
              </div>
            )}

            {uninstallerStatus === 'scanning' && (
              <div className="scanning-hud">
                <div className="spinner"></div>
                <p>{t('scanLeftovers', { name: selectedApp?.name })}</p>
              </div>
            )}

            {uninstallerStatus === 'scanned' && (
              <div className="results-container">
                <div className="results-header">
                  <h2>{t('leftoversTitle', { name: selectedApp?.name })}</h2>
                  <div style={{ display: 'flex', gap: '12px' }}>
                    <button className="btn btn-secondary" onClick={() => setUninstallerStatus('idle')}>{t('back')}</button>
                    <button className="btn btn-danger" onClick={handleUninstallRun}>{t('uninstallBtn')}</button>
                  </div>
                </div>
                <div className="results-list">
                  {leftovers.map((item, idx) => (
                    <div key={idx} className="result-item">
                      <div className="item-left">
                        <input 
                          type="checkbox" 
                          className="checkbox-custom"
                          checked={!!selectedLeftovers[item.path]}
                          onChange={() => setSelectedLeftovers(prev => ({ ...prev, [item.path]: !prev[item.path] }))}
                        />
                        <div>
                          <div style={{ fontWeight: 500 }}>{formatPath(item.path)}</div>
                          <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>{item.type}</div>
                        </div>
                      </div>
                      <span className="item-size" style={{ color: item.type.includes('Bundle') ? 'var(--accent-blue)' : 'inherit' }}>{item.size}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {uninstallerStatus === 'cleaning' && (
              <div className="scanning-hud"><div className="spinner"></div><p>{t('uninstalling')}</p></div>
            )}

            {uninstallerStatus === 'cleaned' && uninstallSummary && (
              <div className="card" style={{ border: '1px solid var(--accent-green)', backgroundColor: 'rgba(52, 199, 89, 0.03)', textAlign: 'center', padding: '40px', gap: '20px' }}>
                <span style={{ fontSize: '64px' }}>🎉</span>
                <h2>{t('uninstallSuccess')}</h2>
                <p style={{ color: 'var(--text-secondary)' }}>{t('uninstallSuccessDesc', { count: uninstallSummary.deletedCount })}</p>
                <button className="btn btn-primary" style={{ alignSelf: 'center' }} onClick={() => setUninstallerStatus('idle')}>{t('back')}</button>
              </div>
            )}
          </>
        )}

        {/* TAB 4: STARTUP */}
        {activeTab === 'startup' && (
          <>
            <div className="page-header">
              <div>
                <h1 className="page-title">{t('startupTitle')}</h1>
                <p className="page-subtitle">{t('startupSubtitle')}</p>
              </div>
            </div>

            {startupLoading ? (
              <div className="scanning-hud"><div className="spinner"></div><p>{t('loadingStartup')}</p></div>
            ) : (
              <div className="card" style={{ padding: '0px', overflow: 'hidden' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid var(--border-color)', backgroundColor: 'rgba(255, 255, 255, 0.02)' }}>
                      <th style={{ padding: '16px' }}>{t('startupName')}</th>
                      <th style={{ padding: '16px', width: '150px' }}>{t('status')}</th>
                      <th style={{ padding: '16px', width: '120px' }}>{t('action')}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {startupItems.map((item, idx) => (
                      <tr key={idx} style={{ borderBottom: '1px solid var(--border-color)' }}>
                        <td style={{ padding: '16px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <span style={{ fontWeight: 600 }}>{item.name}</span>
                            {item.isSystem && (
                              <span style={{ fontSize: '9px', padding: '2px 6px', borderRadius: '4px', backgroundColor: 'rgba(255, 255, 255, 0.08)', color: 'var(--text-secondary)' }}>
                                System
                              </span>
                            )}
                          </div>
                          <div style={{ fontSize: '11px', color: 'var(--text-secondary)', marginTop: '2px' }}>{formatPath(item.path)}</div>
                        </td>
                        <td style={{ padding: '16px' }}>
                          <span 
                            className={`level-badge ${item.enabled ? 'safe' : 'deep'}`}
                            style={{ padding: '4px 10px', borderRadius: '12px', fontSize: '11px' }}
                          >
                            {item.enabled ? t('enabled') : t('disabled')}
                          </span>
                        </td>
                        <td style={{ padding: '16px' }}>
                          {/* Toggle Switch */}
                          <label style={{ 
                            display: 'inline-block', 
                            width: '44px', 
                            height: '24px', 
                            position: 'relative', 
                            cursor: item.isSystem ? 'not-allowed' : 'pointer',
                            opacity: item.isSystem ? 0.5 : 1
                          }}>
                            <input 
                              type="checkbox" 
                              checked={item.enabled}
                              disabled={item.isSystem}
                              onChange={() => handleToggleStartup(item)}
                              style={{ opacity: 0, width: 0, height: 0 }}
                            />
                            <span style={{
                              position: 'absolute',
                              top: 0, left: 0, right: 0, bottom: 0,
                              backgroundColor: item.isSystem ? 'rgba(255, 255, 255, 0.05)' : (item.enabled ? 'var(--accent-blue)' : 'rgba(255, 255, 255, 0.1)'),
                              borderRadius: '24px',
                              transition: '0.3s'
                            }}>
                              <span style={{
                                position: 'absolute',
                                width: '18px', height: '18px',
                                left: item.enabled ? '22px' : '3px',
                                bottom: '3px',
                                backgroundColor: item.isSystem ? '#555' : '#fff',
                                borderRadius: '50%',
                                transition: '0.3s'
                              }}></span>
                            </span>
                          </label>
                        </td>
                      </tr>
                    ))}
                    {startupItems.length === 0 && (
                      <tr><td colSpan="3" style={{ padding: '24px', textAlign: 'center' }}>{t('noStartup')}</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </>
        )}

        {/* TAB 5: DISK MAP */}
        {activeTab === 'diskMap' && (
          <>
            <div className="page-header">
              <div>
                <h1 className="page-title">{t('diskMapTitle')}</h1>
                <p className="page-subtitle">{t('diskMapSubtitle')}</p>
              </div>
            </div>

            {/* Breadcrumbs */}
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '16px' }}>
              <button 
                className="btn btn-primary" 
                onClick={handleSelectFolder}
                style={{ padding: '6px 12px', fontSize: '13px' }}
              >
                📁 {t('selectFolder')}
              </button>
              <button 
                className="btn btn-secondary" 
                onClick={handleGoUp}
                disabled={isHomeDirectory(diskMapPath)}
                style={{ padding: '6px 12px', fontSize: '13px' }}
              >
                ⬅️ {t('upFolder')}
              </button>
              <div style={{
                flexGrow: 1,
                padding: '8px 12px',
                borderRadius: '8px',
                border: '1px solid var(--border-color)',
                backgroundColor: 'rgba(255, 255, 255, 0.02)',
                fontSize: '13px',
                fontFamily: 'monospace',
                overflowX: 'auto',
                whiteSpace: 'nowrap'
              }}>
                {t('currentPath')} {formatPath(diskMapPath)}
              </div>
            </div>

            {diskMapLoading ? (
              <div className="scanning-hud"><div className="spinner"></div><p>{t('scanningDisk')}</p></div>
            ) : (
              <div className="results-container" style={{ padding: '0px', overflow: 'hidden' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid var(--border-color)', backgroundColor: 'rgba(255, 255, 255, 0.02)' }}>
                      <th style={{ padding: '16px' }}>{t('itemName')}</th>
                      <th style={{ padding: '16px', width: '150px' }}>{t('size')}</th>
                      <th style={{ padding: '16px', width: '120px' }}>{t('action')}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {diskMapData && diskMapData.items.map((item, idx) => (
                      <tr 
                        key={idx} 
                        style={{ borderBottom: '1px solid var(--border-color)', cursor: item.isDirectory ? 'pointer' : 'default' }}
                        onClick={() => item.isDirectory && fetchDiskMap(item.path)}
                      >
                        <td style={{ padding: '16px' }}>
                          <span style={{ marginRight: '8px' }}>{item.isDirectory ? '📁' : '📄'}</span>
                          <span style={{ fontWeight: 500, color: item.isDirectory ? 'var(--accent-blue)' : 'inherit' }}>{item.name}</span>
                        </td>
                        <td style={{ padding: '16px', fontWeight: 600 }}>{item.sizeStr}</td>
                        <td style={{ padding: '16px' }} onClick={(e) => e.stopPropagation()}>
                          <button 
                            className="btn btn-danger" 
                            onClick={() => handleDeleteLargeFile(item.path, item.name)}
                            style={{ padding: '6px 12px', fontSize: '12px', borderRadius: '6px' }}
                          >
                            {t('delete')}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </>
        )}

        {/* TAB 6: ABOUT */}
        {activeTab === 'about' && (
          <div className="card" style={{ gap: '20px' }}>
            <h1 style={{ fontSize: '28px' }}>{t('aboutTitle')}</h1>
            <p style={{ color: 'var(--text-secondary)', lineHeight: '1.6' }}>{t('aboutDesc')}</p>
            <hr style={{ borderColor: 'var(--border-color)' }} />
            <div>
              <h3>{t('features')}</h3>
              <ul style={{ paddingLeft: '20px', marginTop: '10px', lineHeight: '1.8' }}>
                <li>{t('feature1')}</li>
                <li>{t('feature2')}</li>
                <li>{t('feature3')}</li>
                <li>{t('feature4')}</li>
              </ul>
            </div>
            <hr style={{ borderColor: 'var(--border-color)' }} />
            <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>{t('version')} 1.0.0 (Mole Core: 1.45.0) | macOS</span>
          </div>
        )}

      </div>
    </div>
  );
}

export default App;
