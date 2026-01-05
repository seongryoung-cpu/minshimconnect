# 🚀 빠른 배포 가이드

## Android 앱 배포 (가장 빠름)

### 1. Android Studio 설치
- [Android Studio 다운로드](https://developer.android.com/studio)
- 설치 후 SDK Manager에서 최신 SDK 설치

### 2. 앱 빌드
```bash
cd flutter_webview
./build_android.sh appbundle
```

또는:
```bash
flutter build appbundle --release
```

### 3. Google Play Console에 업로드
1. [Google Play Console](https://play.google.com/console) 접속
2. 계정 생성 ($25 일회성)
3. 새 앱 만들기
4. `build/app/outputs/bundle/release/app-release.aab` 업로드
5. 스토어 정보 입력 및 제출

**예상 시간**: 1-2일 (심사 포함)

---

## iOS 앱 배포

### 1. Xcode 설치
- App Store에서 Xcode 검색 및 설치 (무료, 약 10GB)

### 2. Apple Developer 계정 생성
- [Apple Developer](https://developer.apple.com) 접속
- 계정 생성 (연간 $99)

### 3. 앱 빌드
```bash
cd flutter_webview
./build_ios.sh
```

또는:
```bash
flutter build ios --release
```

### 4. Xcode에서 배포
```bash
open ios/Runner.xcworkspace
```

Xcode에서:
1. Product → Archive
2. Organizer → Distribute App
3. App Store Connect에 업로드

### 5. App Store Connect에서 제출
1. [App Store Connect](https://appstoreconnect.apple.com) 접속
2. 새 앱 만들기
3. 빌드 선택 및 제출

**예상 시간**: 1-3일 (심사 포함)

---

## 📋 배포 전 체크리스트

### 필수 항목
- [ ] 앱 이름: "민심잇다" ✅ (이미 설정됨)
- [ ] 앱 아이콘 설정 (1024x1024 PNG)
- [ ] 버전 번호 확인 (현재: 1.0.0+1)
- [ ] 앱 설명 작성
- [ ] 스크린샷 준비 (최소 2개)

### Android 추가
- [ ] 앱 서명 키 생성
- [ ] Google Play Console 계정 생성

### iOS 추가
- [ ] Bundle ID 설정
- [ ] Apple Developer 계정 생성
- [ ] CocoaPods 설치

---

## 💡 팁

1. **앱 아이콘**: [App Icon Generator](https://www.appicon.co) 사용
2. **스크린샷**: 실제 기기에서 캡처
3. **앱 설명**: 명확하고 간결하게
4. **테스트**: 실제 기기에서 충분히 테스트

---

## 🆘 문제 해결

### Android 빌드 오류
```bash
flutter clean
flutter pub get
flutter build appbundle --release
```

### iOS 빌드 오류
```bash
cd ios
pod deintegrate
pod install
cd ..
flutter clean
flutter build ios --release
```

---

자세한 내용은 `DEPLOYMENT_GUIDE.md` 참고하세요!
