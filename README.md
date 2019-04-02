# dsshuttle

### 소스 내려 받은 후 명령어 순서
> + npm add @babel/runtime
> + npm install 

> + ~~react-native link react-native-cardview~~
> + ~~react-native link react-native-maps~~
> + ~~react-native link react-native-reanimated~~
> + ~~react-native link react-native-gesture-handler~~



### initial commit 기준 패키지 설치 순서 (참고용으로, 소스 다운로드 후 설치 하지 말것)

> 1.네비게이션
> + npm install --save react-navigation
> + npm install --save react-native-gesture-handler
> + react-native link react-native-gesture-handler

> 2.탭뷰
> + npm install --save react-native-reanimated
> + react-native link react-native-reanimated

> 3.ios x sare area
> + npm install --save react-native-safe-area-view

> 4.맵
> + npm install --save react-native-maps
> + react-native link react-native-maps
(단, 맵이 19년 3월 22일 기준으로 "Could not resolve all files for configuration ':react-native-maps:debugCompileClasspath'." 버그 있음, 따라서 버전을 강제로 다운 받아야 함 ...버전은 'npm install --save https://github.com/react-native-community/react-native-maps.git#v0.24-rc1')
> + android manifest에 사용중인 구글맵 api key 수동 추가
