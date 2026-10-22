package com.edencover.jeu;

import android.app.Activity;
import android.os.Bundle;
import android.webkit.WebChromeClient;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;

/** Jeu EDENCOVER entierement hors ligne ; HTML/CSS/JS embarques dans l'APK. */
public class MainActivity extends Activity {
    private WebView gameWebView;
    @Override public void onCreate(Bundle state) {
        super.onCreate(state);
        gameWebView = new WebView(this);
        gameWebView.setBackgroundColor(0xFF09221B);
        WebSettings settings = gameWebView.getSettings();
        settings.setJavaScriptEnabled(true);
        settings.setDomStorageEnabled(true);
        settings.setAllowFileAccess(true);
        settings.setAllowContentAccess(false);
        settings.setJavaScriptCanOpenWindowsAutomatically(false);
        settings.setDefaultTextEncodingName("UTF-8");
        gameWebView.setWebChromeClient(new WebChromeClient());
        gameWebView.setWebViewClient(new WebViewClient());
        setContentView(gameWebView);
        gameWebView.loadUrl("file:///android_asset/www/index.html");
    }
    @Override public void onDestroy() {
        if (gameWebView != null) {
            gameWebView.destroy();
            gameWebView = null;
        }
        super.onDestroy();
    }
}
