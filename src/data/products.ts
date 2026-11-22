export interface ProductVariant {
  platform: 'AMD' | 'Intel';
  cpu: string;
  gpu: string;
  memory: string;
  cooling: string;
  motherboard: string;
  averageFps: number;
  image: string;
  image480: string;
}

export interface ProductFamily {
  slug: string;
  name: string;
  icon: string;
  tagline: string;
  price: number;
  resolution: string;
  summary: string;
  bestFor: string[];
  variants: ProductVariant[];
}

export const products: ProductFamily[] = [
  {
    slug: 'scout-start', name: 'Scout Start', icon: '🎮', tagline: 'Первый игровой ПК без переплаты', price: 79000,
    resolution: 'Full HD, киберспортивные игры',
    summary: 'Базовая игровая серия для CS2, Dota 2, Valorant, Fortnite и повседневных задач. Конфигурация рассчитана на стабильный Full HD и дальнейший точечный апгрейд.',
    bestFor: ['CS2, Dota 2 и Valorant', 'Учёба и повседневные задачи', 'Первый игровой компьютер', 'Бюджетный вход в Full HD'],
    variants: [
      { platform: 'Intel', cpu: 'Intel Core i3-12100F', gpu: 'GeForce RTX 5050 8GB', memory: '16GB DDR4 3200MHz', cooling: 'Thermalright Assassin X120', motherboard: 'H610M', averageFps: 116, image: '/images/optimized/pc1-960.webp', image480: '/images/optimized/pc1-480.webp' },
      { platform: 'AMD', cpu: 'AMD Ryzen 5 5500', gpu: 'GeForce RTX 5050 8GB', memory: '16GB DDR4 3200MHz', cooling: 'Thermalright Assassin X120', motherboard: 'A520M', averageFps: 109, image: '/images/optimized/pc5-960.webp', image480: '/images/optimized/pc5-480.webp' },
    ],
  },
  {
    slug: 'scout-gamer', name: 'Scout Gamer', icon: '⚔', tagline: 'Универсальный игровой ПК для 1080p Ultra', price: 105000,
    resolution: 'Full HD, высокие и ультра-настройки',
    summary: 'Сбалансированная серия для современных игр в Full HD, высокого FPS и комфортной многозадачности. Подходит большинству игроков, которым нужен запас производительности без перехода в дорогой топовый сегмент.',
    bestFor: ['Современные игры в 1080p', 'Высокие и ультра-настройки', 'Мониторы с высокой частотой', 'Игры, общение и запись контента'],
    variants: [
      { platform: 'Intel', cpu: 'Intel Core i5-13400F', gpu: 'GeForce RTX 5060 8GB', memory: '32GB DDR4', cooling: 'Thermalright Assassin X120', motherboard: 'B760M', averageFps: 150, image: '/images/optimized/pc2-960.webp', image480: '/images/optimized/pc2-480.webp' },
      { platform: 'AMD', cpu: 'AMD Ryzen 5 7500F', gpu: 'GeForce RTX 5060 8GB', memory: '16GB DDR5', cooling: 'Thermalright Assassin X120', motherboard: 'B650', averageFps: 151, image: '/images/optimized/pc6-960.webp', image480: '/images/optimized/pc6-480.webp' },
    ],
  },
  {
    slug: 'scout-pro', name: 'Scout Pro', icon: '🔥', tagline: 'Высокий FPS в 1440p', price: 200000,
    resolution: '1440p, высокие настройки и высокий FPS',
    summary: 'Производительная серия для требовательных игр в 1440p, стриминга и тяжёлой многозадачности. Видеокарта RTX 5070 и мощная платформа дают заметный запас под новые проекты.',
    bestFor: ['Игры в 1440p', 'Высокочастотные мониторы', 'Стриминг и запись', 'Монтаж и тяжёлая многозадачность'],
    variants: [
      { platform: 'Intel', cpu: 'Intel Core i5-13600KF', gpu: 'GeForce RTX 5070 12GB', memory: '32GB DDR5', cooling: 'СЖО 360 мм', motherboard: 'B760', averageFps: 185, image: '/images/optimized/pc3-960.webp', image480: '/images/optimized/pc3-480.webp' },
      { platform: 'AMD', cpu: 'AMD Ryzen 7 7800X3D', gpu: 'GeForce RTX 5070 12GB', memory: '32GB DDR5', cooling: 'СЖО 360 мм', motherboard: 'B650', averageFps: 198, image: '/images/optimized/pc7-960-v2.webp', image480: '/images/optimized/pc7-480.webp' },
    ],
  },
  {
    slug: 'scout-elite', name: 'Scout Elite', icon: '👑', tagline: 'Максимальная игровая производительность', price: 270000,
    resolution: '1440p Ultra и 4K',
    summary: 'Флагманская серия ScoutPC для максимальных настроек, 4K, стриминга, рендера и профессиональных задач. Конфигурация строится вокруг RTX 5070 Ti 16GB и мощных современных процессоров.',
    bestFor: ['1440p Ultra и 4K', 'Стриминг без компромиссов', 'Рендер и монтаж', 'Максимальный запас производительности'],
    variants: [
      { platform: 'Intel', cpu: 'Intel Core Ultra 7 265K', gpu: 'GeForce RTX 5070 Ti 16GB', memory: '32GB DDR5', cooling: 'СЖО 360 мм', motherboard: 'B860', averageFps: 208, image: '/images/optimized/pc4-960.webp', image480: '/images/optimized/pc4-480.webp' },
      { platform: 'AMD', cpu: 'AMD Ryzen 7 9800X3D', gpu: 'GeForce RTX 5070 Ti 16GB', memory: '32GB DDR5', cooling: 'СЖО 360 мм', motherboard: 'B850', averageFps: 222, image: '/images/optimized/pc8-960.webp', image480: '/images/optimized/pc8-480.webp' },
    ],
  },
];
