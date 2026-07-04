import Cocoa
import WebKit

class AppDelegate: NSObject, NSApplicationDelegate, NSWindowDelegate, WKScriptMessageHandler {
    var window: NSWindow!
    var webView: WKWebView!
    var nodeProcess: Process?

    func applicationDidFinishLaunching(_ notification: Notification) {
        // 1. Khởi động Node.js backend server
        startBackendServer()

        // 2. Thiết lập cửa sổ macOS app (Kích thước 1050x700)
        let windowStyle: NSWindow.StyleMask = [.titled, .closable, .miniaturizable, .resizable]
        window = NSWindow(
            contentRect: NSRect(x: 0, y: 0, width: 1050, height: 700),
            styleMask: windowStyle,
            backing: .buffered,
            defer: false
        )
        window.center()
        window.title = "SachMac"
        window.titlebarAppearsTransparent = true
        window.titleVisibility = .hidden
        window.delegate = self
        window.makeKeyAndOrderFront(nil)

        // 3. Khởi tạo WKWebView
        let config = WKWebViewConfiguration()
        let contentController = WKUserContentController()
        contentController.add(self, name: "selectFolder")
        config.userContentController = contentController
        
        webView = WKWebView(frame: window.contentView!.bounds, configuration: config)
        webView.autoresizingMask = [.width, .height]
        
        // Hỗ trợ Glassmorphism/Dark Mode trên webview background
        webView.setValue(false, forKey: "drawsBackground") 
        
        window.contentView?.addSubview(webView)

        // 4. Load trang local server (đợi 1 giây để server Node.js khởi động xong)
        DispatchQueue.main.asyncAfter(deadline: .now() + 1.0) {
            if let url = URL(string: "http://127.0.0.1:4000") {
                let request = URLRequest(url: url)
                self.webView.load(request)
            }
        }
    }

    func startBackendServer() {
        let process = Process()
        process.executableURL = URL(fileURLWithPath: "/usr/bin/env")
        
        // Đường dẫn tuyệt đối của script backend nằm trong bundle app Resources
        let appBundlePath = Bundle.main.bundlePath
        let serverScriptPath = "\(appBundlePath)/Contents/Resources/backend/server.js"
        
        process.arguments = ["node", serverScriptPath]
        
        // Cấu hình môi trường chứa đường dẫn Node.js của Homebrew/npm
        var environment = ProcessInfo.processInfo.environment
        let currentPath = environment["PATH"] ?? ""
        environment["PATH"] = "/opt/homebrew/bin:/usr/local/bin:/usr/bin:/bin:/usr/sbin:/sbin:\(currentPath)"
        process.environment = environment
        
        // Bỏ qua stdout/stderr hoặc chuyển hướng để tránh spam console
        let pipe = Pipe()
        process.standardOutput = pipe
        process.standardError = pipe
        
        do {
            try process.run()
            self.nodeProcess = process
            print("SachMac Backend Server started dynamically with configured PATH.")
        } catch {
            print("Failed to start backend server: \(error)")
        }
    }

    func stopBackendServer() {
        if let process = self.nodeProcess, process.isRunning {
            process.terminate()
            print("SachMac Backend Server stopped.")
        }
    }

    func applicationWillTerminate(_ notification: Notification) {
        stopBackendServer()
    }

    func windowWillClose(_ notification: Notification) {
        NSApplication.shared.terminate(nil)
    }

    // Xử lý sự kiện mở Folder Picker native từ Webview
    func userContentController(_ userContentController: WKUserContentController, didReceive message: WKScriptMessage) {
        if message.name == "selectFolder" {
            DispatchQueue.main.async {
                let openPanel = NSOpenPanel()
                openPanel.canChooseDirectories = true
                openPanel.canChooseFiles = false
                openPanel.allowsMultipleSelection = false
                openPanel.prompt = "Chọn thư mục"
                
                openPanel.beginSheetModal(for: self.window) { (result) in
                    if result == .OK {
                        if let url = openPanel.url {
                            let path = url.path
                            let js = "if (window.onFolderSelected) { window.onFolderSelected('\(path)'); }"
                            self.webView.evaluateJavaScript(js, completionHandler: nil)
                        }
                    }
                }
            }
        }
    }
}

// Chạy ứng dụng Cocoa
let app = NSApplication.shared
let delegate = AppDelegate()
app.delegate = delegate
app.run()
