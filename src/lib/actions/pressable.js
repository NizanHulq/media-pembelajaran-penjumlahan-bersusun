export function pressable(node) {
  let pressed = false;

  function setPressed(on) {
    if (pressed === on) return;
    pressed = on;
    if (on) {
      node.setAttribute('data-pressed', 'true');
    } else {
      node.removeAttribute('data-pressed');
    }
  }

  const onDown = (e) => {
    // Only primary pointer
    if (e.button != null && e.button !== 0) return;
    setPressed(true);
    // Ensure we clear if pointer is canceled or leaves
    window.addEventListener('pointerup', onUp, { once: true });
    window.addEventListener('pointercancel', onCancel, { once: true });
    window.addEventListener('blur', onCancel, { once: true });
    window.addEventListener('visibilitychange', onVisibility, { once: true });
  };

  const onUp = () => setPressed(false);
  const onCancel = () => setPressed(false);
  const onVisibility = () => setPressed(false);

  node.addEventListener('pointerdown', onDown);

  return {
    destroy() {
      node.removeEventListener('pointerdown', onDown);
      setPressed(false);
    }
  };
}

