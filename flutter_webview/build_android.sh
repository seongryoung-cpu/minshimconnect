#!/bin/bash

# Android 앱 빌드 스크립트
# 사용법: ./build_android.sh [apk|appbundle]

set -e

echo "🚀 민심잇다 Android 앱 빌드 시작..."

# Flutter 경로 설정
export PATH="$PATH:$HOME/flutter/bin"

# 빌드 타입 확인
BUILD_TYPE=${1:-appbundle}

if [ "$BUILD_TYPE" = "apk" ]; then
    echo "📦 APK 빌드 중..."
    flutter build apk --release
    echo "✅ 빌드 완료: build/app/outputs/flutter-apk/app-release.apk"
elif [ "$BUILD_TYPE" = "appbundle" ]; then
    echo "📦 App Bundle 빌드 중..."
    flutter build appbundle --release
    echo "✅ 빌드 완료: build/app/outputs/bundle/release/app-release.aab"
    echo "📤 Google Play Console에 업로드할 준비가 되었습니다!"
else
    echo "❌ 잘못된 빌드 타입: $BUILD_TYPE"
    echo "사용법: ./build_android.sh [apk|appbundle]"
    exit 1
fi

echo ""
echo "📝 다음 단계:"
echo "1. Google Play Console (https://play.google.com/console) 접속"
echo "2. 새 앱 만들기"
echo "3. 빌드된 파일 업로드"
echo "4. 스토어 정보 입력 및 제출"
