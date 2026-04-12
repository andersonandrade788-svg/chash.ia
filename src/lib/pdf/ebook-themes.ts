export interface EbookTheme {
  id: string
  name: string
  emoji: string
  primary: [number, number, number]
  secondary: [number, number, number]
  light: [number, number, number]
}

export const EBOOK_THEMES: EbookTheme[] = [
  { id: 'roxo',     name: 'Roxo',     emoji: '💜', primary: [120, 40, 200],  secondary: [90, 20, 160],   light: [230, 210, 255] },
  { id: 'azul',     name: 'Azul',     emoji: '💙', primary: [30, 90, 220],   secondary: [20, 60, 180],   light: [210, 225, 255] },
  { id: 'verde',    name: 'Verde',    emoji: '💚', primary: [16, 160, 100],  secondary: [10, 120, 70],   light: [200, 245, 225] },
  { id: 'vermelho', name: 'Vermelho', emoji: '❤️', primary: [210, 35, 45],   secondary: [170, 20, 30],   light: [255, 210, 212] },
  { id: 'dourado',  name: 'Dourado',  emoji: '🌟', primary: [200, 140, 20],  secondary: [160, 100, 10],  light: [255, 240, 200] },
  { id: 'rosa',     name: 'Rosa',     emoji: '🩷', primary: [210, 40, 130],  secondary: [170, 20, 100],  light: [255, 210, 235] },
  { id: 'preto',    name: 'Preto',    emoji: '🖤', primary: [20, 20, 35],    secondary: [10, 10, 20],    light: [220, 220, 230] },
  { id: 'ciano',    name: 'Ciano',    emoji: '🩵', primary: [0, 170, 210],   secondary: [0, 130, 170],   light: [200, 240, 255] },
]
