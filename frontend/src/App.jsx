import React, { useState, useEffect } from 'react';

const TRANSLATIONS = {
  vi: {
    dashboard: "Dashboard",
    clean: "Dọn dẹp",
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
    connectionError: "Không thể kết nối tới Backend API. Vui lòng đảm bảo server đang chạy."
  },
  en: {
    dashboard: "Dashboard",
    clean: "Clean",
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
    connectionError: "Could not connect to Backend API. Please make sure the server is running."
  }
};

function App() {
  const [lang, setLang] = useState(() => {
    return localStorage.getItem('sachmac_lang') || 'vi';
  });
  const [activeTab, setActiveTab] = useState('dashboard');
  const [cleanLevel, setCleanLevel] = useState('safe');
  const [systemStatus, setSystemStatus] = useState(null);
  const [scanStatus, setScanStatus] = useState('idle'); // idle | scanning | scanned | cleaning | cleaned
  const [scanResults, setScanResults] = useState([]);
  const [selectedItems, setSelectedItems] = useState({});
  const [cleanSummary, setCleanSummary] = useState(null);

  // Helper dịch thuật
  const t = (key, replaceObj = {}) => {
    let text = TRANSLATIONS[lang][key] || TRANSLATIONS['vi'][key] || key;
    Object.keys(replaceObj).forEach(k => {
      text = text.replace(`{${k}}`, replaceObj[k]);
    });
    return text;
  };

  // Lưu ngôn ngữ khi thay đổi
  const changeLanguage = (newLang) => {
    setLang(newLang);
    localStorage.setItem('sachmac_lang', newLang);
  };

  // Fetch trạng thái hệ thống định kỳ (5 giây một lần)
  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const res = await fetch('http://127.0.0.1:4000/api/system-status');
        const data = await res.json();
        setSystemStatus(data);
      } catch (err) {
        console.error('Lỗi khi lấy trạng thái hệ thống:', err);
      }
    };

    fetchStatus();
    const interval = setInterval(fetchStatus, 5000);
    return () => clearInterval(interval);
  }, []);

  // Thực hiện quét (Scan) hệ thống
  const handleScan = async () => {
    setScanStatus('scanning');
    setScanResults([]);
    setSelectedItems({});
    setCleanSummary(null);

    try {
      const res = await fetch('http://127.0.0.1:4000/api/scan');
      const data = await res.json();
      setScanResults(data);
      setScanStatus('scanned');

      // Tự động chọn tất cả các mục quét được
      const initialSelection = {};
      data.forEach(cat => {
        cat.items.forEach(item => {
          initialSelection[item.title] = true;
        });
      });
      setSelectedItems(initialSelection);
    } catch (err) {
      console.error('Lỗi quét hệ thống:', err);
      setScanStatus('idle');
      alert(t('connectionError'));
    }
  };

  // Thực hiện dọn dẹp (Clean) các mục được chọn
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
      
      // Refresh lại thông số hệ thống
      const statusRes = await fetch('http://127.0.0.1:4000/api/system-status');
      const statusData = await statusRes.json();
      setSystemStatus(statusData);
    } catch (err) {
      console.error('Lỗi dọn dẹp:', err);
      setScanStatus('scanned');
      alert('Error during cleaning process.');
    }
  };

  // Toggle chọn một item
  const handleToggleItem = (title) => {
    setSelectedItems(prev => ({
      ...prev,
      [title]: !prev[title]
    }));
  };

  // Lọc kết quả quét theo cấp độ dọn dẹp đã chọn
  const getFilteredResults = () => {
    if (cleanLevel === 'safe') {
      return scanResults.filter(cat => cat.level === 'safe');
    }
    if (cleanLevel === 'advanced') {
      return scanResults.filter(cat => cat.level === 'safe' || cat.level === 'advanced');
    }
    return scanResults; // deep - lấy tất cả
  };

  // Tính tổng dung lượng file rác quét được
  const getTotalTrashSize = () => {
    let totalMB = 0;
    getFilteredResults().forEach(cat => {
      cat.items.forEach(item => {
        const sizeStr = item.size.toLowerCase();
        let val = parseFloat(sizeStr);
        if (sizeStr.includes('gb')) val *= 1024;
        else if (sizeStr.includes('kb')) val /= 1024;
        else if (sizeStr.includes('b') && !sizeStr.includes('kb') && !sizeStr.includes('mb') && !sizeStr.includes('gb')) val /= (1024 * 1024);
        totalMB += val;
      });
    });
    return totalMB > 1024 ? `${(totalMB / 1024).toFixed(2)} GB` : `${totalMB.toFixed(1)} MB`;
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
            <li 
              className={`nav-item ${activeTab === 'dashboard' ? 'active' : ''}`}
              onClick={() => setActiveTab('dashboard')}
            >
              <span className="nav-icon">📊</span> {t('dashboard')}
            </li>
            <li 
              className={`nav-item ${activeTab === 'clean' ? 'active' : ''}`}
              onClick={() => setActiveTab('clean')}
            >
              <span className="nav-icon">🧹</span> {t('clean')}
            </li>
            <li 
              className={`nav-item ${activeTab === 'about' ? 'active' : ''}`}
              onClick={() => setActiveTab('about')}
            >
              <span className="nav-icon">ℹ️</span> {t('about')}
            </li>
          </ul>
        </div>

        {/* Nút chuyển đổi ngôn ngữ và HUD hệ thống */}
        <div>
          <div style={{ display: 'flex', gap: '8px', padding: '10px 14px', marginBottom: '14px', alignItems: 'center' }}>
            <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>🌐</span>
            <button 
              onClick={() => changeLanguage('vi')}
              style={{
                background: lang === 'vi' ? 'rgba(0, 122, 255, 0.2)' : 'transparent',
                border: 'none',
                color: lang === 'vi' ? '#fff' : 'var(--text-secondary)',
                fontWeight: lang === 'vi' ? 'bold' : 'normal',
                padding: '2px 8px',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '12px'
              }}
            >
              VI
            </button>
            <button 
              onClick={() => changeLanguage('en')}
              style={{
                background: lang === 'en' ? 'rgba(0, 122, 255, 0.2)' : 'transparent',
                border: 'none',
                color: lang === 'en' ? '#fff' : 'var(--text-secondary)',
                fontWeight: lang === 'en' ? 'bold' : 'normal',
                padding: '2px 8px',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '12px'
              }}
            >
              EN
            </button>
          </div>

          {systemStatus && (
            <div className="system-status-sidebar">
              <div className="status-row">
                <span className="status-label">CPU</span>
                <span className="status-value">{systemStatus.cpu.load}%</span>
              </div>
              <div className="status-row">
                <span className="status-label">RAM</span>
                <span className="status-value">{systemStatus.ram.percentage}%</span>
              </div>
              <div className="status-row">
                <span className="status-label">Disk</span>
                <span className="status-value">{systemStatus.disk.percentage}%</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Main Content */}
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
                {/* Card CPU */}
                <div className="card">
                  <div className="card-header">
                    <span className="card-title">{t('cpu')}</span>
                    <span className="card-icon">⚙️</span>
                  </div>
                  <div className="card-body">
                    <h2>{systemStatus.cpu.load}% <span style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>{t('running')}</span></h2>
                    <div className="progress-bar-container">
                      <div 
                        className={`progress-bar ${systemStatus.cpu.load > 80 ? 'yellow' : 'blue'}`}
                        style={{ width: `${systemStatus.cpu.load}%` }}
                      ></div>
                    </div>
                    <span className="card-detail" style={{ marginTop: '10px' }}>
                      <span>Model: {systemStatus.cpu.model.split('@')[0]}</span>
                    </span>
                  </div>
                </div>

                {/* Card RAM */}
                <div className="card">
                  <div className="card-header">
                    <span className="card-title">{t('ram')}</span>
                    <span className="card-icon">🧠</span>
                  </div>
                  <div className="card-body">
                    <h2>{systemStatus.ram.usedGB} GB <span style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>/ {systemStatus.ram.totalGB} GB ({systemStatus.ram.percentage}%)</span></h2>
                    <div className="progress-bar-container">
                      <div 
                        className={`progress-bar ${systemStatus.ram.percentage > 85 ? 'yellow' : 'green'}`}
                        style={{ width: `${systemStatus.ram.percentage}%` }}
                      ></div>
                    </div>
                    <div className="card-detail" style={{ marginTop: '10px' }}>
                      <span>{t('free')}: {systemStatus.ram.freeGB} GB</span>
                    </div>
                  </div>
                </div>

                {/* Card Disk */}
                <div className="card">
                  <div className="card-header">
                    <span className="card-title">{t('disk')}</span>
                    <span className="card-icon">💾</span>
                  </div>
                  <div className="card-body">
                    <h2>{systemStatus.disk.usedGB} GB <span style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>/ {systemStatus.disk.totalGB} GB ({systemStatus.disk.percentage}%)</span></h2>
                    <div className="progress-bar-container">
                      <div 
                        className={`progress-bar ${systemStatus.disk.percentage > 90 ? 'yellow' : 'blue'}`}
                        style={{ width: `${systemStatus.disk.percentage}%` }}
                      ></div>
                    </div>
                    <div className="card-detail" style={{ marginTop: '10px' }}>
                      <span>{t('free')}: {systemStatus.disk.freeGB} GB</span>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="scanning-hud">
                <div className="spinner"></div>
                <p>{t('loadingSystem')}</p>
              </div>
            )}

            <div className="card" style={{ marginTop: '16px', display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '20px' }}>
              <span style={{ fontSize: '32px' }}>🧹</span>
              <div>
                <h3>{t('wantToClean')}</h3>
                <p style={{ color: 'var(--text-secondary)', marginTop: '4px' }}>{t('cleanDescription')}</p>
              </div>
              <button 
                className="btn btn-primary" 
                style={{ marginLeft: 'auto' }}
                onClick={() => setActiveTab('clean')}
              >
                {t('goToClean')}
              </button>
            </div>
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

            {/* Lựa chọn cấp độ dọn dẹp */}
            {scanStatus === 'idle' && (
              <div>
                <h3>{t('chooseLevel')}</h3>
                <div className="clean-level-grid">
                  <div 
                    className={`level-card safe ${cleanLevel === 'safe' ? 'active' : ''}`}
                    onClick={() => setCleanLevel('safe')}
                  >
                    <div className="level-header">
                      <span className="level-title">{t('safeLevel')}</span>
                      <span className="level-badge safe">Safe</span>
                    </div>
                    <p className="level-desc">{t('safeDesc')}</p>
                  </div>

                  <div 
                    className={`level-card advanced ${cleanLevel === 'advanced' ? 'active' : ''}`}
                    onClick={() => setCleanLevel('advanced')}
                  >
                    <div className="level-header">
                      <span className="level-title">{t('advancedLevel')}</span>
                      <span className="level-badge advanced">Advanced</span>
                    </div>
                    <p className="level-desc">{t('advancedDesc')}</p>
                  </div>

                  <div 
                    className={`level-card deep ${cleanLevel === 'deep' ? 'active' : ''}`}
                    onClick={() => setCleanLevel('deep')}
                  >
                    <div className="level-header">
                      <span className="level-title">{t('deepLevel')}</span>
                      <span className="level-badge deep">Deep</span>
                    </div>
                    <p className="level-desc">{t('deepDesc')}</p>
                  </div>
                </div>

                <div className="actions-section">
                  <button className="btn btn-primary" onClick={handleScan}>
                    {t('startScan')}
                  </button>
                </div>
              </div>
            )}

            {/* Trạng thái đang quét */}
            {scanStatus === 'scanning' && (
              <div className="scanning-hud">
                <div className="spinner"></div>
                <p style={{ fontWeight: 500 }}>{t('scanning')}</p>
              </div>
            )}

            {/* Hiển thị kết quả quét */}
            {scanStatus === 'scanned' && (
              <div className="results-container">
                <div className="results-header">
                  <div>
                    <h2 className="results-title">{t('freeableSpace')} <span style={{ color: 'var(--accent-green)' }}>{getTotalTrashSize()}</span></h2>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '13px', marginTop: '4px' }}>
                      {t('currentLevel')} <span style={{ textTransform: 'capitalize', fontWeight: 'bold' }}>{cleanLevel}</span>
                    </p>
                  </div>
                  <div style={{ display: 'flex', gap: '12px' }}>
                    <button className="btn btn-secondary" onClick={() => setScanStatus('idle')}>
                      {t('back')}
                    </button>
                    <button className="btn btn-primary" onClick={handleClean}>
                      {t('cleanNow')}
                    </button>
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
                        <div key={itemIdx} className="result-item" style={{ marginBottom: '6px' }}>
                          <div className="item-left">
                            <input 
                              type="checkbox" 
                              className="checkbox-custom"
                              checked={!!selectedItems[item.title]}
                              onChange={() => handleToggleItem(item.title)}
                            />
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

            {/* Trạng thái đang dọn dẹp */}
            {scanStatus === 'cleaning' && (
              <div className="scanning-hud">
                <div className="spinner" style={{ borderTopColor: 'var(--accent-green)' }}></div>
                <p style={{ fontWeight: 500 }}>{t('cleaning')}</p>
              </div>
            )}

            {/* Kết quả sau khi dọn dẹp thành công */}
            {scanStatus === 'cleaned' && cleanSummary && (
              <div className="card" style={{ border: '1px solid var(--accent-green)', backgroundColor: 'rgba(52, 199, 89, 0.03)', textAlign: 'center', padding: '40px', gap: '20px' }}>
                <span style={{ fontSize: '64px' }}>🎉</span>
                <h2>{t('cleanSuccess')}</h2>
                <p style={{ color: 'var(--text-secondary)', maxWidth: '500px', margin: '0 auto' }}>
                  {t('cleanSuccessDesc')} {t('deletedCount', { count: cleanSummary.deletedPathsCount })}
                </p>
                {cleanSummary.failedPathsCount > 0 && (
                  <p style={{ color: 'var(--accent-yellow)', fontSize: '13px' }}>
                    {t('failedPaths', { count: cleanSummary.failedPathsCount })}
                  </p>
                )}
                <div className="actions-section">
                  <button className="btn btn-primary" onClick={() => setScanStatus('idle')}>
                    {t('back')}
                  </button>
                </div>
              </div>
            )}
          </>
        )}

        {/* TAB 3: ABOUT */}
        {activeTab === 'about' && (
          <div className="card" style={{ gap: '20px' }}>
            <h1 style={{ fontSize: '28px' }}>{t('aboutTitle')}</h1>
            <p style={{ color: 'var(--text-secondary)', lineHeight: '1.6' }}>
              {t('aboutDesc')}
            </p>
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
