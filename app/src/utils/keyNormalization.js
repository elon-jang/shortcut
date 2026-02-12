// YAML 키 이름 → 키보드 이벤트에서 사용하는 이름으로 변환
// useKeyboard.js에서 이미 Meta→Cmd, Control→Ctrl, Alt→Option, Arrow*→방향 변환을 하고 있으므로
// 여기서는 YAML 쪽 표기를 useKeyboard 출력에 맞추는 정규화만 수행

const YAML_TO_KEYBOARD = {
  'Opt': 'Option',
  'Return': 'Enter',
  'Esc': 'Escape',
  '←': 'Left',
  '→': 'Right',
  '↑': 'Up',
  '↓': 'Down',
  '⌫': 'Backspace',
  'Delete': 'Backspace',
};

/**
 * YAML 단축키 문자열의 개별 키를 키보드 이벤트 이름으로 정규화
 * 예: "Ctrl + Opt + ⌫" → ["Ctrl", "Option", "Backspace"]
 */
export function normalizeKeys(keysString) {
  return keysString.split('+').map(k => {
    const trimmed = k.trim();
    return YAML_TO_KEYBOARD[trimmed] || trimmed;
  });
}
