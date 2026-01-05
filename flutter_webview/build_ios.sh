#!/bin/bash

# iOS 앱 빌드 스크립트
# 사용법: ./build_ios.sh

set -e

echo "🚀 민심잇다 iOS 앱 빌드 시작..."

# Flutter 경로 설정
export PATH="$PATH:$HOME/flutter/bin"

# CocoaPods 설치 확인
if ! command -v pod &> /dev/null; then
    echo "⚠️  CocoaPods가 설치되지 않았습니다."
    echo "설치 중: sudo gem install cocoapods"
    sudo gem install cocoapods
fi

# CocoaPods 의존성 설치
echo "📦 CocoaPods 의존성 설치 중..."
cd ios
pod install
cd ..

# iOS 빌드
echo "📦 iOS 빌드 중..."
flutter build ios --release

echo "✅ 빌드 완료!"
echo ""
echo "📝 다음 단계:"
echo "1. Xcode에서 프로젝트 열기:"
echo "   open ios/Runner.xcworkspace"
echo ""
echo "2. Xcode에서:"
echo "   - Product → Archive"
echo "   - Organizer → Distribute App"
echo "   - App Store Connect에 업로드"
echo ""
echo "3. App Store Connect (https://appstoreconnect.apple.com)에서:"
echo "   - 새 앱 만들기"
echo "   - 빌드 선택 및 제출"
