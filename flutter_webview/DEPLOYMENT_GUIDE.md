# 📱 앱 출시 가이드

민심잇다 웹뷰 앱을 Android와 iOS 앱 스토어에 배포하는 방법입니다.

---

## 🎯 목차

1. [사전 준비](#사전-준비)
2. [Android 앱 빌드 및 배포](#android-앱-빌드-및-배포)
3. [iOS 앱 빌드 및 배포](#ios-앱-빌드-및-배포)
4. [앱 정보 설정](#앱-정보-설정)
5. [빌드 및 테스트](#빌드-및-테스트)

---

## 📋 사전 준비

### 필수 요구사항

#### Android 배포
- ✅ Android Studio 설치
- ✅ Android SDK 설치
- ✅ Google Play Console 계정 (비용: $25 일회성)
- ✅ 앱 서명 키 생성

#### iOS 배포
- ✅ macOS (필수)
- ✅ Xcode 설치 (App Store에서 무료)
- ✅ Apple Developer 계정 (연간 $99)
- ✅ CocoaPods 설치

---

## 🤖 Android 앱 빌드 및 배포

### 1단계: Android Studio 설치

1. [Android Studio 다운로드](https://developer.android.com/studio)
2. 설치 후 실행
3. SDK Manager에서 다음 설치:
   - Android SDK Platform-Tools
   - Android SDK Build-Tools
   - Android SDK (최신 버전)

### 2단계: 앱 서명 키 생성

```bash
cd flutter_webview/android
keytool -genkey -v -keystore ~/minshim-release-key.jks -keyalg RSA -keysize 2048 -validity 10000 -alias minshim
```

**중요**: 키 파일과 비밀번호를 안전하게 보관하세요!

### 3단계: 키 설정 파일 생성

`android/key.properties` 파일 생성:

```properties
storePassword=YOUR_STORE_PASSWORD
keyPassword=YOUR_KEY_PASSWORD
keyAlias=minshim
storeFile=/Users/seongryoung/minshim-release-key.jks
```

### 4단계: build.gradle 수정

`android/app/build.gradle` 파일에 서명 설정 추가 (이미 설정되어 있을 수 있음)

### 5단계: 앱 빌드

```bash
cd flutter_webview
flutter build appbundle
```

빌드된 파일: `build/app/outputs/bundle/release/app-release.aab`

### 6단계: Google Play Console에 업로드

1. [Google Play Console](https://play.google.com/console) 접속
2. 새 앱 만들기
3. 앱 정보 입력:
   - 앱 이름: 민심잇다
   - 기본 언어: 한국어
   - 앱 또는 게임: 앱
   - 무료 또는 유료: 무료
4. 프로덕션 트랙에 AAB 파일 업로드
5. 스토어 등록정보 작성:
   - 앱 설명
   - 스크린샷 (최소 2개)
   - 앱 아이콘 (512x512)
   - 기능 그래픽 (1024x500)
6. 콘텐츠 등급 설정
7. 타겟 대상 및 콘텐츠 설정
8. 가격 및 배포 설정
9. 검토 제출

---

## 🍎 iOS 앱 빌드 및 배포

### 1단계: Xcode 설치

1. App Store에서 Xcode 검색 및 설치 (무료, 약 10GB)
2. 설치 후 실행하여 추가 구성 요소 설치

### 2단계: CocoaPods 설치

```bash
sudo gem install cocoapods
```

### 3단계: Apple Developer 계정 준비

1. [Apple Developer](https://developer.apple.com) 접속
2. 계정 생성 (연간 $99)
3. 인증서 및 프로비저닝 프로파일 생성

### 4단계: Xcode에서 프로젝트 설정

```bash
cd flutter_webview/ios
pod install
```

Xcode에서:
1. `ios/Runner.xcworkspace` 열기
2. Signing & Capabilities에서:
   - Team 선택
   - Bundle Identifier 설정 (예: com.yourcompany.minshim)
   - Automatically manage signing 체크

### 5단계: 앱 빌드

```bash
cd flutter_webview
flutter build ios --release
```

또는 Xcode에서:
1. Product → Archive
2. Organizer에서 Distribute App 선택
3. App Store Connect에 업로드

### 6단계: App Store Connect에 업로드

1. [App Store Connect](https://appstoreconnect.apple.com) 접속
2. 새 앱 만들기:
   - 이름: 민심잇다
   - 기본 언어: 한국어
   - 번들 ID: com.yourcompany.minshim
   - SKU: 고유 식별자
3. 앱 정보 입력:
   - 설명
   - 키워드
   - 카테고리
   - 스크린샷 (다양한 기기 크기)
   - 앱 아이콘 (1024x1024)
4. 빌드 선택 및 제출
5. 앱 심사 제출

---

## ⚙️ 앱 정보 설정

### 앱 이름 변경

`pubspec.yaml`:
```yaml
name: minshim_webview
description: 민심잇다 - 당신의 의견이 정책이 됩니다
version: 1.0.0+1
```

### Android 앱 이름

`android/app/src/main/AndroidManifest.xml`:
```xml
<application
    android:label="민심잇다"
    ...>
```

### iOS 앱 이름

`ios/Runner/Info.plist`:
```xml
<key>CFBundleDisplayName</key>
<string>민심잇다</string>
```

### 앱 아이콘 설정

#### Android
- `android/app/src/main/res/mipmap-*/ic_launcher.png` 파일 교체
- 다양한 해상도 필요:
  - mipmap-mdpi: 48x48
  - mipmap-hdpi: 72x72
  - mipmap-xhdpi: 96x96
  - mipmap-xxhdpi: 144x144
  - mipmap-xxxhdpi: 192x192

#### iOS
- `ios/Runner/Assets.xcassets/AppIcon.appiconset/` 폴더에 아이콘 추가
- 다양한 크기 필요 (Xcode에서 자동 생성 가능)

**팁**: [App Icon Generator](https://www.appicon.co) 사용 권장

---

## 🔨 빌드 및 테스트

### Android APK 빌드 (테스트용)

```bash
flutter build apk --release
```

빌드된 파일: `build/app/outputs/flutter-apk/app-release.apk`

### Android App Bundle 빌드 (배포용)

```bash
flutter build appbundle --release
```

빌드된 파일: `build/app/outputs/bundle/release/app-release.aab`

### iOS 빌드

```bash
flutter build ios --release
```

### 테스트

#### Android
```bash
flutter install
```

또는 APK 파일을 직접 기기에 설치

#### iOS
Xcode에서 시뮬레이터 또는 실제 기기에서 테스트

---

## 📝 체크리스트

### Android 배포 전
- [ ] 앱 이름 설정
- [ ] 앱 아이콘 설정
- [ ] 버전 번호 확인
- [ ] 서명 키 생성
- [ ] 인터넷 권한 확인
- [ ] 앱 테스트 완료
- [ ] Google Play Console 계정 생성
- [ ] 스토어 등록정보 작성

### iOS 배포 전
- [ ] 앱 이름 설정
- [ ] 앱 아이콘 설정
- [ ] Bundle ID 설정
- [ ] Apple Developer 계정 생성
- [ ] 인증서 및 프로파일 생성
- [ ] 앱 테스트 완료
- [ ] App Store Connect 계정 생성
- [ ] 스토어 등록정보 작성

---

## 🚀 빠른 시작

### Android (가장 빠름)

```bash
# 1. 빌드
flutter build appbundle --release

# 2. Google Play Console에 업로드
# 3. 스토어 정보 입력
# 4. 제출
```

### iOS

```bash
# 1. CocoaPods 설치
cd ios && pod install && cd ..

# 2. Xcode에서 프로젝트 열기
open ios/Runner.xcworkspace

# 3. Xcode에서 Archive → Distribute App
```

---

## 💡 팁

1. **앱 아이콘**: 1024x1024 PNG 파일 준비
2. **스크린샷**: 최소 2개 이상 필요 (다양한 화면)
3. **앱 설명**: 명확하고 간결하게 작성
4. **키워드**: 검색 최적화를 위해 신중하게 선택
5. **테스트**: 실제 기기에서 충분히 테스트

---

## 📞 문제 해결

### Android 빌드 오류
- `flutter clean` 실행 후 다시 빌드
- Android SDK 경로 확인
- Gradle 버전 확인

### iOS 빌드 오류
- `pod install` 재실행
- Xcode에서 Clean Build Folder
- CocoaPods 업데이트: `pod repo update`

---

## 📚 참고 자료

- [Flutter 배포 가이드](https://docs.flutter.dev/deployment)
- [Google Play Console](https://play.google.com/console)
- [App Store Connect](https://appstoreconnect.apple.com)
- [Android 앱 서명](https://developer.android.com/studio/publish/app-signing)
- [iOS 앱 배포](https://developer.apple.com/distribute/)

---

**행운을 빕니다! 🎉**
