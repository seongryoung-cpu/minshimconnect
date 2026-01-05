# VS Code에서 Flutter 웹뷰 앱 실행 가이드

## 📋 사전 준비사항

### 1. Flutter 설치 확인
- Flutter가 설치되어 있는지 확인: `~/flutter/bin/flutter`
- PATH 설정 확인: `~/.zshrc`에 Flutter 경로가 추가되어 있어야 합니다

### 2. VS Code 확장 프로그램 설치

#### 필수 확장 프로그램:
1. **Flutter** (Dart-Code.dart-code)
   - VS Code 확장 탭에서 "Flutter" 검색
   - "Flutter" 확장 설치 (Dart 확장도 자동 설치됨)

2. **확인 방법:**
   - `Cmd+Shift+X` (확장 프로그램 탭 열기)
   - "Flutter" 검색
   - 설치되어 있으면 "설치됨" 표시

---

## 🚀 실행 방법 (단계별)

### 방법 1: 디버그 모드로 실행 (권장)

#### Step 1: 프로젝트 열기
1. VS Code 실행
2. `File` → `Open Folder...` (또는 `Cmd+O`)
3. 다음 경로 선택:
   ```
   /Users/seongryoung/Downloads/민심잇다-(minshim-itda) (4)/flutter_webview
   ```

#### Step 2: 터미널에서 의존성 설치
1. VS Code 하단의 터미널 열기 (`Ctrl+`` 또는 `View` → `Terminal`)
2. 다음 명령어 실행:
   ```bash
   flutter pub get
   ```
3. 완료되면 "Got dependencies!" 메시지 확인

#### Step 3: 실행
**옵션 A: F5 키 사용**
- 키보드에서 `F5` 키 누르기
- 또는 상단 메뉴: `Run` → `Start Debugging`

**옵션 B: 실행 버튼 사용**
- 왼쪽 사이드바의 "Run and Debug" 아이콘 클릭 (▶️ 아이콘)
- 상단의 "민심잇다 웹뷰" 선택
- 초록색 재생 버튼 클릭

**옵션 C: 명령 팔레트 사용**
- `Cmd+Shift+P` (또는 `Ctrl+Shift+P`)
- "Flutter: Run Flutter" 입력 후 선택
- 디바이스 선택 (Chrome 또는 macOS)

#### Step 4: 디바이스 선택
실행 시 디바이스 선택 창이 나타납니다:
- **Chrome** (웹) - 권장: 웹뷰 앱 테스트에 최적
- **macOS** (데스크톱) - macOS 앱으로 실행

---

### 방법 2: 터미널에서 직접 실행

#### Step 1: VS Code 터미널 열기
- `Ctrl+`` 또는 `View` → `Terminal`

#### Step 2: 실행 명령어 입력
```bash
# Chrome에서 실행
flutter run -d chrome

# macOS에서 실행
flutter run -d macos

# 사용 가능한 디바이스 확인
flutter devices
```

---

## 🔧 문제 해결

### 문제 1: "Flutter SDK를 찾을 수 없습니다"

**해결 방법:**
1. `Cmd+Shift+P` → "Flutter: Change SDK" 입력
2. Flutter SDK 경로 입력:
   ```
   /Users/seongryoung/flutter
   ```
3. VS Code 재시작

### 문제 2: "Flutter 명령어를 찾을 수 없습니다"

**해결 방법:**
1. 터미널에서 다음 명령어 실행:
   ```bash
   export PATH="$PATH:$HOME/flutter/bin"
   ```
2. VS Code 터미널을 새로 열기
3. 또는 VS Code 재시작

### 문제 3: "No devices found"

**해결 방법:**
1. Chrome 브라우저가 설치되어 있는지 확인
2. 터미널에서 `flutter devices` 실행하여 사용 가능한 디바이스 확인
3. Android/iOS 에뮬레이터가 필요하면:
   - Android: Android Studio 설치
   - iOS: Xcode 설치

### 문제 4: 의존성 오류

**해결 방법:**
```bash
flutter clean
flutter pub get
```

### 문제 5: VS Code에서 Flutter 확장이 작동하지 않음

**해결 방법:**
1. VS Code 재시작
2. Flutter 확장 재설치
3. `Cmd+Shift+P` → "Developer: Reload Window"

---

## 📱 실행 모드 설명

### Debug 모드 (F5)
- 디버깅 정보 포함
- 핫 리로드 가능
- 개발 중 사용

### Profile 모드
- 성능 분석 가능
- 디버깅 정보 일부 포함
- 성능 테스트용

### Release 모드
- 최적화된 빌드
- 디버깅 정보 없음
- 배포용

---

## 🎯 실행 후 확인사항

1. **Chrome 브라우저가 자동으로 열림**
2. **웹뷰 앱이 로드됨** (https://www.minshimconnect.com)
3. **하단에 디버그 툴바 표시**:
   - Hot Reload (⚡)
   - Hot Restart (🔄)
   - Stop (⏹)

---

## 💡 유용한 단축키

- `F5`: 디버그 시작
- `Ctrl+F5`: 디버그 없이 실행
- `Shift+F5`: 디버그 중지
- `Ctrl+Shift+F5`: 재시작
- `Ctrl+Shift+F12`: 핫 리로드
- `Cmd+Shift+P`: 명령 팔레트

---

## 📝 추가 팁

1. **자동 저장 및 핫 리로드:**
   - 파일 저장 시 자동으로 핫 리로드
   - VS Code 설정에서 "Flutter: Hot Reload On Save" 활성화

2. **디버그 콘솔:**
   - 하단의 "Debug Console" 탭에서 로그 확인
   - `print()` 문 출력 확인 가능

3. **디바이스 변경:**
   - 실행 중에도 디바이스 변경 가능
   - 디버그 툴바에서 디바이스 선택

4. **웹뷰 개발자 도구:**
   - Chrome에서 `F12`로 개발자 도구 열기
   - 웹뷰 내부 HTML/CSS 확인 가능

---

## 🆘 여전히 문제가 있나요?

1. VS Code를 완전히 종료 후 재시작
2. 터미널을 새로 열어서 `flutter doctor` 실행
3. Flutter 확장 프로그램 업데이트 확인
4. 프로젝트 폴더를 다시 열기
