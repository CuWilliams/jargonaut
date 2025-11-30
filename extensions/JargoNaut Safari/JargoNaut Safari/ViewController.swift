//
//  ViewController.swift
//  JargoNaut Safari
//
//  Created by Curtis Williams on 2025-10-07.
//

import Cocoa
import SafariServices
import WebKit

let extensionBundleIdentifier = "com.cuwilliams66.JargoNaut.Extension"

class ViewController: NSViewController, WKNavigationDelegate, WKScriptMessageHandler {

    @IBOutlet var webView: WKWebView!

    override func viewDidLoad() {
        super.viewDidLoad()

        self.webView.navigationDelegate = self

        self.webView.configuration.userContentController.add(self, name: "controller")

        self.webView.loadFileURL(Bundle.main.url(forResource: "Main", withExtension: "html")!, allowingReadAccessTo: Bundle.main.resourceURL!)
    }

    func webView(_ webView: WKWebView, didFinish navigation: WKNavigation!) {
        SFSafariExtensionManager.getStateOfSafariExtension(withIdentifier: extensionBundleIdentifier) { (state, error) in
            guard let state = state, error == nil else {
                // Insert code to inform the user that something went wrong.
                return
            }

            DispatchQueue.main.async {
                if #available(macOS 13, *) {
                    webView.evaluateJavaScript("show(\(state.isEnabled), true)")
                } else {
                    webView.evaluateJavaScript("show(\(state.isEnabled), false)")
                }
            }
        }
    }

    func userContentController(_ userContentController: WKUserContentController, didReceive message: WKScriptMessage) {
        if (message.body as! String != "open-preferences") {
            return;
        }

        if #available(macOS 13, *) {
            // For macOS 13+, open System Settings directly to Extensions
            NSWorkspace.shared.open(URL(string: "x-apple.systempreferences:com.apple.preferences.extensions")!)
            DispatchQueue.main.async {
                NSApplication.shared.terminate(nil)
            }
        } else {
            // For older macOS, try the old API
            SFSafariApplication.showPreferencesForExtension(withIdentifier: extensionBundleIdentifier) { error in
                if let error = error {
                    print("Error opening preferences: \(error.localizedDescription)")
                }
                DispatchQueue.main.async {
                    NSApplication.shared.terminate(nil)
                }
            }
        }
    }

}
