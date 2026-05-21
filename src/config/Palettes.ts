export type ColorBlindMode = 'normal' | 'protanopia' | 'deuteranopia' | 'tritanopia';

export interface Palette {
  background: number;
  panel: number;
  panelBorder: number;
  textPrimary: number;
  textSecondary: number;
  accent: number;
  accentAlt: number;
  success: number;
  failure: number;
  warning: number;
  focusRing: number;
}

const base: Palette = {
  background: 0xf3e6c4,
  panel: 0xd9b380,
  panelBorder: 0x5b3a1e,
  textPrimary: 0x3b2410,
  textSecondary: 0x6b4a2b,
  accent: 0xb45b1f,
  accentAlt: 0x2f7d4a,
  success: 0x2f7d4a,
  failure: 0xb1382a,
  warning: 0xd9a441,
  focusRing: 0x1f6feb,
};

export const Palettes: Record<ColorBlindMode, Palette> = {
  normal: base,
  protanopia: {
    ...base,
    accent: 0x9a7a1f,
    accentAlt: 0x3a6fa3,
    success: 0x3a6fa3,
    failure: 0x9a7a1f,
    warning: 0xc7a23a,
  },
  deuteranopia: {
    ...base,
    accent: 0xaf6b1d,
    accentAlt: 0x2a5e8f,
    success: 0x2a5e8f,
    failure: 0xaf6b1d,
    warning: 0xc9a93b,
  },
  tritanopia: {
    ...base,
    accent: 0xb83a3a,
    accentAlt: 0x1e7a87,
    success: 0x1e7a87,
    failure: 0xb83a3a,
    warning: 0xcc7a3a,
  },
};

export const toCssHex = (color: number): string => `#${color.toString(16).padStart(6, '0')}`;
