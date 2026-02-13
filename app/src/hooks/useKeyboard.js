import { useState, useEffect, useCallback } from 'react';

export const useKeyboard = (isActive, onKeyCombo) => {
  const [pressedKeys, setPressedKeys] = useState(new Set());

  const resetKeys = useCallback(() => {
    setPressedKeys(new Set());
  }, []);

  useEffect(() => {
    if (!isActive) {
      setPressedKeys(new Set());
      return;
    }

    const handleKeyDown = (e) => {
      // Let navigation handler handle Escape
      if (e.key === 'Escape') return;

      e.preventDefault();
      const key = e.key;

      let keyName = key;
      if (key === 'Meta') keyName = 'Cmd';
      if (key === 'Control') keyName = 'Ctrl';
      if (key === 'Alt') keyName = 'Option';
      if (key === ' ') keyName = 'Space';
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(key)) {
        keyName = key.replace('Arrow', '');
      }

      const newPressed = new Set(pressedKeys);
      const isModifier = ['Cmd', 'Ctrl', 'Option', 'Shift'].includes(keyName);
      const normalizedKey = keyName.charAt(0).toUpperCase() + keyName.slice(1);
      newPressed.add(normalizedKey);
      setPressedKeys(new Set(newPressed));

      if (!isModifier && onKeyCombo) {
        onKeyCombo(newPressed);
      }
    };

    const handleKeyUp = () => {
      setPressedKeys(new Set());
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [isActive, pressedKeys, onKeyCombo]);

  return { pressedKeys, resetKeys };
};
