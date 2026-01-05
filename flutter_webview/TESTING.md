# Flutter 웹뷰 앱 테스트 가이드

## 🧪 테스트 방법

### 1. macOS 데스크톱 앱으로 테스트 (권장)

```bash
cd flutter_webview
flutter run -d macos
```

**장점:**
- 네이티브 웹뷰 사용
- 가장 안정적
- 실제 앱과 유사한 경험

### 2. Chrome 웹에서 테스트

```bash
flutter run -d chrome
```

**참고:**
- 웹에서는 iframe 사용
- 일부 제한사항 있을 수 있음
- 에러 발생 시 "새 탭에서 열기" 버튼 사용

### 3. Android 에뮬레이터에서 테스트

**필요사항:** Android Studio 설치

```bash
# 에뮬레이터 시작
flutter emulators --launch <emulator_id>

# 앱 실행
flutter run -d <device_id>
```

### 4. 실제 기기에서 테스트

**Android:**
```bash
# USB 디버깅 활성화 후
flutter devices
flutter run -d <device_id>
```

**iOS:**
```bash
# Xcode 설치 필요
flutter run -d <device_id>
```

---

## ✅ 확인 사항

### 정상 작동 시:
- ✅ 웹사이트가 로드됨
- ✅ 로딩 인디케이터 표시
- ✅ 새로고침 버튼 작동
- ✅ 뒤로가기 버튼 작동 (모바일)

### 문제 발생 시:
- ❌ "localhost에서 연결을 거부했습니다" → 네트워크 확인
- ❌ "WebViewPlatform 오류" → 플랫폼 확인
- ❌ 빈 화면 → 콘솔 로그 확인

---

## 🔍 디버깅

### 로그 확인:
```bash
flutter run -d macos --verbose
```

### 핫 리로드:
- 실행 중 `r` 키 누르기
- 또는 VS Code에서 저장 시 자동 리로드

### 앱 재시작:
- 실행 중 `R` 키 누르기 (대문자)

---

## 📱 현재 사용 가능한 디바이스

```bash
flutter devices
```

일반적으로:
- ✅ macOS (desktop)
- ✅ Chrome (web)
- ⚠️ Android (에뮬레이터 필요)
- ⚠️ iOS (Xcode 필요)
