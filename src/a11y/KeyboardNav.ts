export const KeyboardNav = {
  init(): void {
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Tab') document.body.classList.add('using-keyboard');
    });
    document.addEventListener('mousedown', () => {
      document.body.classList.remove('using-keyboard');
    });
    document.addEventListener('pointerdown', (e) => {
      if (e.pointerType !== 'mouse' && e.pointerType !== 'pen' && e.pointerType !== 'touch') return;
      document.body.classList.remove('using-keyboard');
    });
  },

  announce(text: string, assertive = false): void {
    const id = assertive ? 'a11y-live-assertive' : 'a11y-live';
    const el = document.getElementById(id);
    if (!el) return;
    el.textContent = '';
    requestAnimationFrame(() => {
      el.textContent = text;
    });
  },
};
