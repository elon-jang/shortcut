# Shortcut Pro - Legend Edition

키보드 단축키 학습 게이미피케이션 웹앱. `shortcuts/*.yaml` 데이터를 실시간으로 읽어 표시합니다.

## 실행

```bash
npm install
npm run dev
```

## 학습 모드

| 모드 | 설명 |
|------|------|
| 객관식 퀴즈 | 4지선다로 빠른 판단력 테스트 |
| 리얼 키 입력 | 실제 단축키를 눌러 근육 기억 훈련 |
| 플래시카드 | 카드 뒤집기 자율 반복 암기 |

## 데이터 동기화

Vite 플러그인(`plugins/yaml-shortcuts-plugin.js`)이 `../shortcuts/*.yaml`을 읽어 `virtual:shortcuts` 모듈로 변환합니다.

- YAML 파일 수정 시 dev 서버가 자동 리로드
- 빌드 시에도 YAML에서 직접 읽음 (하드코딩 없음)
- 입력 불가 단축키(`Fn`, 마우스, 범위 표기 등)는 타이핑 모드에서 자동 필터링

## 지원 앱 (14개)

macOS, Chrome, VS Code, Slack, Notion, Gmail, Warp, Raycast, Claude Code, Claude Desktop, Rectangle, Shottr, Grabbit, AULA F87 Pro

## 기술 스택

- React 19 + Vite 7
- Tailwind CSS
- Lucide React
- js-yaml (Vite 플러그인에서 YAML 파싱)

## 빌드

```bash
npm run build    # dist/ 에 프로덕션 빌드
npm run preview  # 빌드 결과 미리보기
```
