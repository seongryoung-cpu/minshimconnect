# 🚀 빠른 시작 가이드

## VS Code에서 3단계로 실행하기

### ✅ Step 1: VS Code에서 프로젝트 열기
1. VS Code 실행
2. `Cmd+O` (또는 File → Open Folder)
3. `flutter_webview` 폴더 선택

### ✅ Step 2: Flutter 확장 확인
- 왼쪽 사이드바에서 확장 아이콘 클릭 (또는 `Cmd+Shift+X`)
- "Flutter" 검색
- 설치되어 있지 않으면 "Install" 클릭

### ✅ Step 3: 실행하기
**가장 쉬운 방법:**
- 키보드에서 `F5` 키 누르기
- 또는 상단 메뉴: `Run` → `Start Debugging`

**디바이스 선택:**
- Chrome 선택 (웹 브라우저에서 실행)
- 또는 macOS 선택 (데스크톱 앱으로 실행)

---

## 🎯 실행 확인

실행이 성공하면:
1. ✅ Chrome 브라우저가 자동으로 열림
2. ✅ 민심잇다 웹사이트가 로드됨
3. ✅ 하단에 디버그 툴바 표시됨

---

## ⚠️ 문제가 있나요?

### "Flutter SDK를 찾을 수 없습니다"
1. `Cmd+Shift+P` 누르기
2. "Flutter: Change SDK" 입력
3. `/Users/seongryoung/flutter` 입력

### "명령어를 찾을 수 없습니다"
1. VS Code 완전 종료
2. 터미널 앱에서 다음 실행:
   ```bash
   export PATH="$PATH:$HOME/flutter/bin"
   code flutter_webview
   ```

### 의존성 오류
VS Code 터미널에서 (`Ctrl+``):
```bash
flutter pub get
```

---

## 📚 더 자세한 내용은
`VSCODE_GUIDE.md` 파일을 참고하세요!
