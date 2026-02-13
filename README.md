# My Shortcuts

애플리케이션 단축키 모음입니다. YAML 파일을 단일 소스로 관리하며, 웹앱과 치트시트에 자동 반영됩니다.

## Shortcut Pro 웹앱

단축키 학습 게이미피케이션 웹앱입니다. YAML 데이터를 실시간으로 읽어 표시합니다.

```bash
cd app && npm install && npm run dev
```

**3가지 학습 모드:**
- **객관식 퀴즈** - 4지선다 빠른 판단력 테스트
- **리얼 키 입력** - 실제 단축키를 눌러 근육 기억 훈련
- **플래시카드** - 자율 반복 암기

YAML 파일을 수정하면 dev 서버가 자동으로 리로드됩니다.

## Learning Loop

웹앱, CLI, 치트시트가 `progress.json`을 통해 학습 데이터를 공유합니다.

```
발견 (Cheat Sheet) → 연습 (Web App) → 복습 (CLI) → 확인 (Cheat Sheet)
```

### Leitner Box 시스템

단축키별로 5단계 박스로 관리하는 간격 반복 학습:

| Box | 간격 | 의미 |
|-----|------|------|
| 1 | 즉시 | 새로운/틀린 단축키 |
| 2 | 1일 | 첫 번째 복습 |
| 3 | 3일 | 익숙해지는 중 |
| 4 | 7일 | 거의 마스터 |
| 5 | 14일 | 마스터 |

- 정답 → Box +1 (최대 5)
- 오답 → Box 1로 리셋

### CLI 학습 명령 (Claude Code)

```bash
/shortcut:shortcut-learn          # 오늘 복습 대상 학습
/shortcut:shortcut-learn chrome   # Chrome 단축키만
/shortcut:shortcut-learn --all    # 전체 복습
/shortcut:shortcut-stats          # 학습 통계 확인
/shortcut:shortcut-cheatsheet --mode progress  # 진행률 반영 치트시트
```

CLI에서 학습하면 `progress.json`이 업데이트되고, 웹앱 재시작 시 자동 동기화됩니다.

### 데이터 동기화

- **Web App → 파일**: ResultScreen의 "Export Progress" 버튼으로 `progress.json` 다운로드
- **파일 → Web App**: `progress.json`이 변경되면 dev 서버가 자동으로 데이터 반영
- 병합 전략: 더 많은 attempts를 가진 데이터를 우선 채택

### 키보드 단축키

웹앱에서 `?` 키를 눌러 전체 키보드 단축키 목록을 확인할 수 있습니다.

## 기타 뷰

- **[Printable Cheat Sheet (A4)](./cheatsheet.html)** - 인쇄용 단축키 모음
- **[Interactive Checklist](./cheatsheet-checklist.html)** - 학습용 체크리스트 + 암기 팁 + 패턴 분석 (독립 localStorage, Learning Loop 미연동)
- **Progress Cheat Sheet** - `/shortcut:shortcut-cheatsheet --mode progress`로 생성. progress.json 기반 색상 코딩 반영

## 구조

```
shortcuts/          YAML 데이터 (Single Source of Truth)
app/                Shortcut Pro 웹앱 (React + Vite)
progress.json       학습 진행 데이터 (Leitner Box, .gitignore 대상)
cheatsheet.html     A4 인쇄용 치트시트
```

## Summary

| App | Shortcuts | Last Updated |
|-----|-----------|--------------|
| [macOS](./shortcuts/macos.yaml) | 14 | 2026-01-29 |
| [Claude Desktop](./shortcuts/claude-desktop.yaml) | 7 | 2026-01-21 |
| [Claude Code](./shortcuts/claude-code.yaml) | 8 | 2026-01-29 |
| [Gmail](./shortcuts/gmail.yaml) | 10 | 2026-01-20 |
| [Chrome](./shortcuts/chrome.yaml) | 15 | 2026-01-29 |
| [Slack](./shortcuts/slack.yaml) | 12 | 2026-01-30 |
| [VS Code](./shortcuts/vscode.yaml) | 5 | 2026-01-19 |
| [Warp](./shortcuts/warp.yaml) | 17 | 2026-01-23 |
| [Rectangle](./shortcuts/rectangle.yaml) | 10 | 2026-01-22 |
| [Shottr](./shortcuts/shottr.yaml) | 7 | 2026-01-22 |
| [Raycast](./shortcuts/raycast.yaml) | 6 | 2026-01-27 |
| [AULA F87 Pro](./shortcuts/aula-f87.yaml) | 6 | 2026-02-02 |
| [Grabbit](./shortcuts/grabbit.yaml) | 1 | 2026-02-03 |
| [Notion](./shortcuts/notion.yaml) | 10 | 2026-02-10 |

**Total**: 128 shortcuts across 14 apps

## Quick Reference

### macOS

| Shortcut | Description |
|----------|-------------|
| Cmd+Space | 스포트라이트 검색 (Spotlight) |
| Cmd+Tab | 앱 전환 (App Switcher) |
| Ctrl+↑ | Mission Control (모든 창 보기) |
| Ctrl+←/→ | 데스크탑(Space) 간 전환 |
| Space | 훑어보기 (Quick Look) |

[View all macOS shortcuts →](./shortcuts/macos.yaml)

### Claude Desktop

| Shortcut | Description |
|----------|-------------|
| Ctrl+Cmd+K | Quick chat (글로벌 호출) |
| Cmd+K | 새 채팅 시작 |
| Shift+Cmd+I | 시크릿 채팅 (Incognito) |
| Cmd+. | 사이드바 토글 |
| Cmd+/ | 명령어 팔레트 |

[View all Claude Desktop shortcuts →](./shortcuts/claude-desktop.yaml)

### Claude Code

| Shortcut | Description |
|----------|-------------|
| Ctrl+Z | 잠깐 멈추고 터미널 쓰기 (백그라운드 전환) |
| ! | Bash 모드 전환 (터미널 명령어 직접 실행) |
| Ctrl+G | 멀티라인 편집 (에디터 열기) |
| Ctrl+S | 프롬프트 임시 저장 (Stash) |
| Esc+Esc | 코드 + 대화 함께 롤백 (Rewind) |

[View all Claude Code shortcuts →](./shortcuts/claude-code.yaml)

### Gmail

| Shortcut | Description |
|----------|-------------|
| C | 새 메일 작성 |
| Cmd+Enter | 메일 보내기 |
| / | 검색창으로 이동 |
| J / K | 다음/이전 메일로 이동 |
| R | 답장하기 (Reply) |

[View all Gmail shortcuts →](./shortcuts/gmail.yaml)

### Chrome

| Shortcut | Description |
|----------|-------------|
| Cmd+L | 주소창 포커스 (URL 입력/복사) |
| Cmd+T | 새 탭 열기 |
| Cmd+W | 현재 탭 닫기 |
| Cmd+Shift+T | 마지막으로 닫은 탭 다시 열기 |
| Cmd+[ | 뒤로 가기 |

[View all Chrome shortcuts →](./shortcuts/chrome.yaml)

### Slack

| Shortcut | Description |
|----------|-------------|
| Cmd+K | 퀵 스위처 - 채널/동료 이름 검색해서 바로 이동 |
| Cmd+[ | 뒤로 가기 - 방금 봤던 이전 채널로 복귀 |
| Opt+Shift+↓ | 안 읽은 메시지 순서대로 순회 |
| E | 메시지 수정 (파란 테두리 선택 모드에서) |
| Shift+Esc | 모두 읽음 처리 - 슬랙 전체 알림 배지 삭제 |

[View all Slack shortcuts →](./shortcuts/slack.yaml)

### VS Code

| Shortcut | Description |
|----------|-------------|
| Cmd+Shift+P | 명령어 팔레트 열기 (모든 기능 검색/실행) |
| Cmd+P | 파일 빠르게 열기 (Quick Open) |
| Cmd+D | 같은 단어 다중 선택 (Multi-Cursor) |
| Option+↑/↓ | 코드 줄 위/아래로 이동 |
| Ctrl+` | 터미널 열기/닫기 |

[View all VS Code shortcuts →](./shortcuts/vscode.yaml)

### Warp

| Shortcut | Description |
|----------|-------------|
| Ctrl+` | AI 명령어 생성 (Generate) |
| Ctrl+Tab | 다음 탭 |
| Ctrl+Shift+Tab | 이전 탭 |
| Cmd+D | 우측 분할 (Split Right) |
| Cmd+P | 명령어 팔레트 |

[View all Warp shortcuts →](./shortcuts/warp.yaml)

### Rectangle

| Shortcut | Description |
|----------|-------------|
| Ctrl+Opt+← | Left Half (왼쪽 절반) |
| Ctrl+Opt+→ | Right Half (오른쪽 절반) |
| Ctrl+Opt+Return | Maximize (최대화) |
| Ctrl+Opt+C | Center (중앙 배치) |
| Ctrl+Opt+Cmd+→ | Next Display (다음 모니터) |

[View all Rectangle shortcuts →](./shortcuts/rectangle.yaml)

### Shottr

| Shortcut | Description |
|----------|-------------|
| Shift+Cmd+1 | Fullscreen screenshot (전체 화면) |
| Shift+Cmd+2 | Area screenshot (영역 선택) |
| Shift+Cmd+7 | Any window screenshot (윈도우 선택) |
| Shift+Cmd+8 | Active window screenshot (활성 윈도우) |
| Shift+Cmd+9 | Scrolling screenshot (스크롤 캡처) |

[View all Shottr shortcuts →](./shortcuts/shottr.yaml)

### Raycast

| Shortcut | Description |
|----------|-------------|
| Cmd+Space | Raycast Launcher (런처 호출) |
| Opt+C | Chrome 즉시 호출 |
| Opt+F | Finder 즉시 호출 |
| Opt+S | Slack 즉시 호출 |
| Opt+V | VS Code 즉시 호출 |

[View all Raycast shortcuts →](./shortcuts/raycast.yaml)

### AULA F87 Pro

| Shortcut | Description |
|----------|-------------|
| Fn+E | Mac 모드 전환 |
| Fn+Insert | 조명 모드 전환 |
| Fn+↑/↓ | 조명 밝게/어둡게 |
| Fn+,/. | 조명 효과 느리게/빠르게 |

[View all AULA F87 Pro shortcuts →](./shortcuts/aula-f87.yaml)

### Grabbit

| Shortcut | Description |
|----------|-------------|
| Opt+왼쪽마우스 | Copy URLs to clipboard (URL 클립보드 복사) |

[View all Grabbit shortcuts →](./shortcuts/grabbit.yaml)

### Notion

| Shortcut | Description |
|----------|-------------|
| Cmd+D | Duplicate (블록 복제) |
| Cmd+/ | Turn into (블록 타입 변경 메뉴) |
| Cmd+Shift+↑/↓ | Move block (블록 위/아래 이동) |
| Cmd+P | Quick Find - 페이지명 입력해 즉시 이동 (검색) |
| Cmd+K | Add Link (선택한 텍스트에 링크 추가) |

[View all Notion shortcuts →](./shortcuts/notion.yaml)
