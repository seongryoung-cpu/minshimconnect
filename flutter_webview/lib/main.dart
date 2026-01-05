import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter/foundation.dart' show kIsWeb;
import 'package:webview_flutter/webview_flutter.dart';
import 'package:webview_flutter_android/webview_flutter_android.dart';
import 'package:webview_flutter_wkwebview/webview_flutter_wkwebview.dart';
import 'package:connectivity_plus/connectivity_plus.dart';

// 웹 플랫폼 전용 import (조건부)
// ignore: avoid_web_libraries_in_flutter
import 'dart:ui_web' as ui_web
    if (dart.library.html) 'dart:ui_web'
    if (dart.library.io) 'lib/web_stub.dart';
// ignore: avoid_web_libraries_in_flutter, deprecated_member_use
import 'dart:html' as html
    if (dart.library.html) 'dart:html'
    if (dart.library.io) 'lib/web_stub.dart';

void main() {
  WidgetsFlutterBinding.ensureInitialized();
  SystemChrome.setPreferredOrientations([
    DeviceOrientation.portraitUp,
    DeviceOrientation.portraitDown,
  ]);
  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: '민심잇다',
      debugShowCheckedModeBanner: false,
      theme: ThemeData(
        primarySwatch: Colors.teal,
        useMaterial3: true,
        appBarTheme: const AppBarTheme(
          backgroundColor: Color(0xFF002b49),
          foregroundColor: Colors.white,
          elevation: 0,
          systemOverlayStyle: SystemUiOverlayStyle(
            statusBarColor: Colors.transparent,
            statusBarIconBrightness: Brightness.light,
            statusBarBrightness: Brightness.dark,
          ),
        ),
      ),
      home: const WebViewScreen(),
    );
  }
}

class WebViewScreen extends StatefulWidget {
  const WebViewScreen({super.key});

  @override
  State<WebViewScreen> createState() => _WebViewScreenState();
}

class _WebViewScreenState extends State<WebViewScreen> {
  WebViewController? _controller;
  bool _isLoading = true;
  bool _hasError = false;
  String _errorMessage = '';
  bool _isConnected = true;
  double _loadingProgress = 0.0;

  // 웹사이트 URL
  static const String websiteUrl = 'https://www.minshimconnect.com';

  @override
  void initState() {
    super.initState();
    if (kIsWeb) {
      // 웹 플랫폼에서는 iframe 초기화
      _initializeWebIframe();
    } else {
      _initializeWebView();
    }
    if (!kIsWeb) {
      _checkConnectivity();
    }
  }

  void _initializeWebIframe() {
    // 웹에서는 직접 웹사이트로 리다이렉트하는 것이 더 나음
    // 또는 iframe을 사용
    if (!kIsWeb) return;
    try {
      ui_web.platformViewRegistry.registerViewFactory(
        'webview-iframe',
        (int viewId) {
          final iframe = html.IFrameElement()
            ..src = websiteUrl
            ..style.border = 'none'
            ..style.width = '100%'
            ..style.height = '100%'
            ..allowFullscreen = true
            ..allow = 'fullscreen *';
          
          // 로드 완료 처리
          iframe.onLoad.listen((event) {
            setState(() {
              _isLoading = false;
              _hasError = false;
            });
          });
          
          // 에러 처리
          iframe.onError.listen((event) {
            setState(() {
              _hasError = true;
              _errorMessage = '페이지를 로드할 수 없습니다.';
              _isLoading = false;
            });
          });
          
          return iframe;
        },
      );
    } catch (e) {
      setState(() {
        _hasError = true;
        _errorMessage = '웹뷰를 초기화할 수 없습니다.';
        _isLoading = false;
      });
    }
  }

  void _initializeWebView() {
    if (kIsWeb) return; // 웹에서는 실행하지 않음
    late final PlatformWebViewControllerCreationParams params;
    
    if (WebViewPlatform.instance is WebKitWebViewPlatform) {
      params = WebKitWebViewControllerCreationParams(
        allowsInlineMediaPlayback: true,
        mediaTypesRequiringUserAction: const <PlaybackMediaTypes>{},
      );
    } else {
      params = AndroidWebViewControllerCreationParams();
    }

    final WebViewController controller = WebViewController.fromPlatformCreationParams(params);

    controller
      ..setJavaScriptMode(JavaScriptMode.unrestricted)
      ..setNavigationDelegate(
        NavigationDelegate(
          onPageStarted: (String url) {
            setState(() {
              _isLoading = true;
              _hasError = false;
              _loadingProgress = 0.0;
            });
          },
          onProgress: (int progress) {
            setState(() {
              _loadingProgress = progress / 100.0;
            });
          },
          onPageFinished: (String url) {
            setState(() {
              _isLoading = false;
            });
          },
          onWebResourceError: (WebResourceError error) {
            setState(() {
              _isLoading = false;
              _hasError = true;
              _errorMessage = error.description;
            });
          },
          onNavigationRequest: (NavigationRequest request) {
            // 외부 링크는 기본 브라우저에서 열기
            if (!request.url.startsWith(websiteUrl) && 
                !request.url.startsWith('https://www.minshimconnect.com')) {
              return NavigationDecision.prevent;
            }
            return NavigationDecision.navigate;
          },
        ),
      )
      ..setBackgroundColor(const Color(0xFFf8fafc))
      ..addJavaScriptChannel(
        'FlutterChannel',
        onMessageReceived: (JavaScriptMessage message) {
          // Flutter와 웹뷰 간 통신 처리
          debugPrint('Message from web: ${message.message}');
        },
      )
      ..loadRequest(Uri.parse(websiteUrl));

    if (controller.platform is AndroidWebViewController) {
      AndroidWebViewController.enableDebugging(false);
      (controller.platform as AndroidWebViewController)
        ..setMediaPlaybackRequiresUserGesture(false)
        ..setOnShowFileSelector(_androidFilePicker);
    }

    _controller = controller;
  }

  Future<List<String>> _androidFilePicker(FileSelectorParams params) async {
    // 파일 선택기 처리 (필요시 구현)
    return [];
  }

  Future<void> _checkConnectivity() async {
    final ConnectivityResult result = await Connectivity().checkConnectivity();
    setState(() {
      _isConnected = result != ConnectivityResult.none;
    });

    Connectivity().onConnectivityChanged.listen((ConnectivityResult result) {
      setState(() {
        _isConnected = result != ConnectivityResult.none;
        if (_isConnected && _hasError && _controller != null) {
          _hasError = false;
          _controller!.reload();
        }
      });
    });
  }

  Future<void> _reload() async {
    if (kIsWeb) {
      // 웹에서는 iframe 다시 초기화
      setState(() {
        _hasError = false;
        _isLoading = true;
      });
      _initializeWebIframe();
      return;
    }
    if (_controller == null) return;
    setState(() {
      _hasError = false;
      _isLoading = true;
    });
    await _controller!.reload();
  }

  Future<bool> _onWillPop() async {
    if (kIsWeb) return true; // 웹에서는 항상 뒤로가기 허용
    if (_controller == null) return true;
    if (await _controller!.canGoBack()) {
      _controller!.goBack();
      return false;
    }
    return true;
  }

  @override
  Widget build(BuildContext context) {
    return PopScope(
      canPop: false,
      onPopInvokedWithResult: (bool didPop, dynamic result) async {
        if (!didPop) {
          final bool shouldPop = await _onWillPop();
          if (shouldPop && context.mounted) {
            Navigator.of(context).pop();
          }
        }
      },
      child: Scaffold(
        backgroundColor: const Color(0xFFf8fafc),
        appBar: AppBar(
          title: const Text(
            '민심잇다',
            style: TextStyle(
              fontWeight: FontWeight.bold,
              fontSize: 18,
            ),
          ),
          actions: [
            if (_isLoading && !kIsWeb)
              const Padding(
                padding: EdgeInsets.all(16.0),
                child: SizedBox(
                  width: 20,
                  height: 20,
                  child: CircularProgressIndicator(
                    strokeWidth: 2,
                    valueColor: AlwaysStoppedAnimation<Color>(Colors.white),
                  ),
                ),
              )
            else
              IconButton(
                icon: const Icon(Icons.refresh),
                onPressed: _reload,
                tooltip: '새로고침',
              ),
          ],
        ),
        body: kIsWeb
            ? _buildWebIframe()
            : Stack(
                children: [
                  if (!_isConnected)
                    _buildNoConnectionView()
                  else if (_hasError)
                    _buildErrorView()
                  else
                    _buildWebView(),
                  if (_isLoading && _isConnected && !_hasError)
                    _buildLoadingIndicator(),
                ],
              ),
      ),
    );
  }

  Widget _buildWebView() {
    if (_controller == null) {
      return const Center(child: CircularProgressIndicator());
    }
    return WebViewWidget(controller: _controller!);
  }

  Widget _buildWebIframe() {
    // 웹에서는 HtmlElementView를 사용하여 iframe 표시
    if (_hasError) {
      return Center(
        child: Padding(
          padding: const EdgeInsets.all(24.0),
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              const Icon(
                Icons.error_outline,
                size: 64,
                color: Colors.red,
              ),
              const SizedBox(height: 16),
              const Text(
                '웹사이트를 로드할 수 없습니다',
                style: TextStyle(
                  fontSize: 18,
                  fontWeight: FontWeight.bold,
                ),
              ),
              const SizedBox(height: 8),
              Text(
                _errorMessage.isNotEmpty
                    ? _errorMessage
                    : '네트워크 연결을 확인하거나 직접 웹사이트를 방문해주세요.',
                textAlign: TextAlign.center,
                style: const TextStyle(fontSize: 14),
              ),
              const SizedBox(height: 24),
              ElevatedButton.icon(
                onPressed: () {
                  html.window.open(websiteUrl, '_blank');
                },
                icon: const Icon(Icons.open_in_browser),
                label: const Text('새 탭에서 열기'),
                style: ElevatedButton.styleFrom(
                  backgroundColor: const Color(0xFF2ed5c4),
                  foregroundColor: Colors.white,
                  padding: const EdgeInsets.symmetric(
                    horizontal: 24,
                    vertical: 12,
                  ),
                ),
              ),
            ],
          ),
        ),
      );
    }
    
    return Stack(
      children: [
        const HtmlElementView(
          viewType: 'webview-iframe',
        ),
        if (_isLoading)
          Container(
            color: Colors.white,
            child: const Center(
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  CircularProgressIndicator(),
                  SizedBox(height: 16),
                  Text('웹사이트를 로드하는 중...'),
                ],
              ),
            ),
          ),
      ],
    );
  }

  Widget _buildLoadingIndicator() {
    return Positioned(
      top: 0,
      left: 0,
      right: 0,
      child: LinearProgressIndicator(
        value: _loadingProgress,
        backgroundColor: Colors.grey[200],
        valueColor: const AlwaysStoppedAnimation<Color>(Color(0xFF2ed5c4)),
        minHeight: 3,
      ),
    );
  }

  Widget _buildNoConnectionView() {
    return Center(
      child: Padding(
        padding: const EdgeInsets.all(24.0),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Icon(
              Icons.wifi_off,
              size: 64,
              color: Colors.grey[400],
            ),
            const SizedBox(height: 16),
            Text(
              '인터넷 연결이 없습니다',
              style: TextStyle(
                fontSize: 18,
                fontWeight: FontWeight.bold,
                color: Colors.grey[700],
              ),
            ),
            const SizedBox(height: 8),
            Text(
              '인터넷 연결을 확인하고 다시 시도해주세요.',
              textAlign: TextAlign.center,
              style: TextStyle(
                fontSize: 14,
                color: Colors.grey[600],
              ),
            ),
            const SizedBox(height: 24),
            ElevatedButton.icon(
              onPressed: _reload,
              icon: const Icon(Icons.refresh),
              label: const Text('다시 시도'),
              style: ElevatedButton.styleFrom(
                backgroundColor: const Color(0xFF2ed5c4),
                foregroundColor: Colors.white,
                padding: const EdgeInsets.symmetric(
                  horizontal: 24,
                  vertical: 12,
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildErrorView() {
    return Center(
      child: Padding(
        padding: const EdgeInsets.all(24.0),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Icon(
              Icons.error_outline,
              size: 64,
              color: Colors.red[300],
            ),
            const SizedBox(height: 16),
            const Text(
              '페이지를 불러올 수 없습니다',
              style: TextStyle(
                fontSize: 18,
                fontWeight: FontWeight.bold,
                color: Colors.black87,
              ),
            ),
            const SizedBox(height: 8),
            Text(
              _errorMessage.isNotEmpty
                  ? _errorMessage
                  : '네트워크 연결을 확인하거나 잠시 후 다시 시도해주세요.',
              textAlign: TextAlign.center,
              style: const TextStyle(
                fontSize: 14,
                color: Colors.black54,
              ),
            ),
            const SizedBox(height: 24),
            ElevatedButton.icon(
              onPressed: _reload,
              icon: const Icon(Icons.refresh),
              label: const Text('다시 시도'),
              style: ElevatedButton.styleFrom(
                backgroundColor: const Color(0xFF2ed5c4),
                foregroundColor: Colors.white,
                padding: const EdgeInsets.symmetric(
                  horizontal: 24,
                  vertical: 12,
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
