import fs from 'fs';
import path from 'path';
import yaml from 'js-yaml';

const YAML_DIR = path.resolve(import.meta.dirname, '../../shortcuts');

const VIRTUAL_MODULE_ID = 'virtual:shortcuts';
const RESOLVED_VIRTUAL_MODULE_ID = '\0' + VIRTUAL_MODULE_ID;

// 카테고리 메타데이터: YAML 파일명 → 웹앱 표시 정보
const CATEGORY_META = {
  'macos':          { icon: '🍎', color: 'bg-slate-700',   text: 'text-slate-400',   desc: '맥 OS 마스터하기' },
  'chrome':         { icon: '🌐', color: 'bg-yellow-500',  text: 'text-yellow-400',  desc: '웹 브라우징 스피드업' },
  'vscode':         { icon: '💻', color: 'bg-blue-500',    text: 'text-blue-400',    desc: '코딩 효율의 정점' },
  'slack':          { icon: '💬', color: 'bg-purple-500',  text: 'text-purple-400',  desc: '팀 커뮤니케이션 마스터' },
  'notion':         { icon: '📝', color: 'bg-stone-500',   text: 'text-stone-400',   desc: '올인원 워크스페이스' },
  'gmail':          { icon: '📧', color: 'bg-red-500',     text: 'text-red-400',     desc: '이메일 생산성 극대화' },
  'warp':           { icon: '🚀', color: 'bg-teal-500',    text: 'text-teal-400',    desc: '차세대 터미널' },
  'raycast':        { icon: '⚡', color: 'bg-orange-500',  text: 'text-orange-400',  desc: '런처 생산성 마스터' },
  'claude-code':    { icon: '🤖', color: 'bg-indigo-500',  text: 'text-indigo-400',  desc: 'AI 코딩 어시스턴트' },
  'claude-desktop': { icon: '🧠', color: 'bg-violet-500',  text: 'text-violet-400',  desc: 'AI 데스크톱 파트너' },
  'rectangle':      { icon: '🪟', color: 'bg-green-500',   text: 'text-green-400',   desc: '창 관리의 달인' },
  'shottr':         { icon: '📸', color: 'bg-pink-500',    text: 'text-pink-400',    desc: '스크린샷 마스터' },
  'grabbit':        { icon: '🎨', color: 'bg-cyan-500',    text: 'text-cyan-400',    desc: '컬러 피킹 도구' },
  'aula-f87':       { icon: '⌨️', color: 'bg-amber-500',   text: 'text-amber-400',   desc: '키보드 커스터마이징' },
};

// 입력 불가 패턴 판별
function isTypeable(shortcut) {
  // 범위 표기: ~ between characters (예: Cmd+1~9) — 단, +~ (tilde key) 제외
  if (/[^+]~/.test(shortcut)) return false;
  // 대안 표기: / (예: Opt+Cmd+←/→) — 단, Cmd+/ 같은 단일 키는 제외
  if (/\//.test(shortcut)) {
    // "/" 자체가 단축키인 경우 (Gmail 검색: "/")
    if (shortcut === '/') return true;
    // modifier+/ 패턴 (예: Cmd+/) 은 typeable
    if (shortcut.endsWith('+/')) return true;
    // 나머지는 대안 표기 (←/→ 등)
    return false;
  }
  // 마우스
  if (shortcut.includes('마우스')) return false;
  // Fn 키
  if (shortcut.includes('Fn+') || shortcut === 'Fn') return false;
  // Insert 키
  if (shortcut.includes('Insert')) return false;
  return true;
}

// 키 포맷 변환: Cmd+Shift+P → Cmd + Shift + P
function formatKeys(shortcut) {
  // 특수 케이스: "!" 같은 따옴표로 감싸진 키
  let cleaned = shortcut.replace(/^["']|["']$/g, '');
  // 괄호 표기 제거: "Delete (⌫)" → "Delete"
  cleaned = cleaned.replace(/\s*\([^)]*\)\s*/g, '').trim();

  // 알려진 키 이름 목록 (+ 분리 시 prefix로 인식)
  const knownKeys = [
    'Cmd', 'Ctrl', 'Opt', 'Option', 'Shift',
    'Esc', 'Space', 'Tab', 'Return', 'Enter', 'Delete', 'Fn',
  ];

  // +를 분리하되, Shift+Cmd++ 같은 경우(마지막 +가 키 자체) 처리
  const parts = [];
  let remaining = cleaned;

  while (remaining.length > 0) {
    let matched = false;
    for (const key of knownKeys) {
      if (remaining.startsWith(key + '+')) {
        parts.push(key);
        remaining = remaining.slice(key.length + 1);
        matched = true;
        break;
      }
    }
    if (!matched) {
      // 남은 부분은 키 자체 (+ 포함 가능)
      parts.push(remaining);
      break;
    }
  }

  return parts.join(' + ');
}

function loadShortcuts() {
  const shortcutData = {};
  const categories = [];

  if (!fs.existsSync(YAML_DIR)) {
    console.warn(`[yaml-shortcuts] YAML directory not found: ${YAML_DIR}`);
    return { shortcutData, categories };
  }

  const files = fs.readdirSync(YAML_DIR)
    .filter(f => f.endsWith('.yaml') || f.endsWith('.yml'))
    .sort();

  for (const file of files) {
    const filePath = path.join(YAML_DIR, file);
    const content = fs.readFileSync(filePath, 'utf-8');
    const data = yaml.load(content);

    if (!data || !data.app || !data.shortcuts) continue;

    const categoryId = path.basename(file, path.extname(file));
    const meta = CATEGORY_META[categoryId] || {
      icon: '📱',
      color: 'bg-gray-500',
      text: 'text-gray-400',
      desc: data.app,
    };

    // 카테고리 등록
    categories.push({
      id: categoryId,
      name: data.app,
      icon: meta.icon,
      color: meta.color,
      text: meta.text,
      desc: meta.desc,
    });

    // 단축키 변환
    const items = [];
    let index = 0;
    for (const section of data.shortcuts) {
      if (!section.items) continue;
      for (const item of section.items) {
        items.push({
          id: `${categoryId}-${index}`,
          action: item.description,
          keys: formatKeys(item.shortcut),
          typeable: isTypeable(item.shortcut),
        });
        index++;
      }
    }
    shortcutData[categoryId] = items;
  }

  return { shortcutData, categories };
}

// 카테고리 표시 순서 정의
const CATEGORY_ORDER = [
  'macos', 'chrome', 'vscode', 'slack', 'notion', 'gmail',
  'warp', 'raycast', 'claude-code', 'claude-desktop',
  'rectangle', 'shottr', 'grabbit', 'aula-f87',
];

export default function yamlShortcutsPlugin() {
  return {
    name: 'yaml-shortcuts',

    resolveId(id) {
      if (id === VIRTUAL_MODULE_ID) {
        return RESOLVED_VIRTUAL_MODULE_ID;
      }
    },

    load(id) {
      if (id === RESOLVED_VIRTUAL_MODULE_ID) {
        const { shortcutData, categories } = loadShortcuts();

        // 카테고리 정렬
        const sortedCategories = categories.sort((a, b) => {
          const ai = CATEGORY_ORDER.indexOf(a.id);
          const bi = CATEGORY_ORDER.indexOf(b.id);
          return (ai === -1 ? 999 : ai) - (bi === -1 ? 999 : bi);
        });

        return `export const SHORTCUT_DATA = ${JSON.stringify(shortcutData, null, 2)};
export const CATEGORIES = ${JSON.stringify(sortedCategories, null, 2)};`;
      }
    },

    configureServer(server) {
      if (!fs.existsSync(YAML_DIR)) return;

      // YAML 디렉토리 감시 → 변경 시 virtual module 무효화 + full-reload
      server.watcher.add(YAML_DIR);

      const handleChange = (filePath) => {
        if (!filePath.startsWith(YAML_DIR)) return;
        if (!filePath.endsWith('.yaml') && !filePath.endsWith('.yml')) return;

        const mod = server.moduleGraph.getModuleById(RESOLVED_VIRTUAL_MODULE_ID);
        if (mod) {
          server.moduleGraph.invalidateModule(mod);
        }
        server.ws.send({ type: 'full-reload' });
      };

      server.watcher.on('change', handleChange);
      server.watcher.on('add', handleChange);
      server.watcher.on('unlink', handleChange);
    },
  };
}
