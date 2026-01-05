# 민심잇다 Flutter 웹뷰 앱

이 프로젝트는 민심잇다 웹사이트를 Flutter 웹뷰로 감싼 모바일 앱입니다.

## 기능

- ✅ 웹사이트 전체 화면 표시
- ✅ 로딩 상태 표시
- ✅ 네트워크 연결 상태 확인
- ✅ 에러 처리 및 재시도 기능
- ✅ 뒤로가기 버튼 지원
- ✅ 새로고침 기능
- ✅ 모바일 최적화

## 설치 및 실행

### 1. Flutter 설치 확인
```bash
flutter --version
```

### 2. 의존성 설치
```bash
cd flutter_webview
flutter pub get
```

### 3. 실행
```bash
# Android
flutter run

# iOS
flutter run -d ios
```

## 빌드

### Android APK 빌드
```bash
flutter build apk --release
```

### iOS 빌드
```bash
flutter build ios --release
```

## 설정

웹사이트 URL은 `lib/main.dart` 파일의 `websiteUrl` 상수에서 변경할 수 있습니다:

```dart
static const String websiteUrl = 'https://www.minshimconnect.com';
```

## 주요 패키지

- `webview_flutter`: 웹뷰 기능 제공
- `connectivity_plus`: 네트워크 연결 상태 확인
- `webview_flutter_android`: Android 웹뷰 최적화
- `webview_flutter_wkwebview`: iOS 웹뷰 최적화

## 주의사항

- Android: `AndroidManifest.xml`에 인터넷 권한이 설정되어 있습니다.
- iOS: `Info.plist`에 네트워크 보안 설정이 포함되어 있습니다.
