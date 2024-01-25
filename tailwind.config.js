/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{vue,js,ts,jsx,tsx}',
  ],
  corePlugins: {
    preflight: false,
  },
  theme: {
    fontFamily: {
      sans: [],
      serif: [],
      mono: [],
    },
    extend: {
      colors: {
        'tg-primary': 'var(--tg-primary-main)',
        'tg-secondary': 'var(--tg-secondary-main)',
        'tg-secondary-light': 'var(--tg-secondary-light)',
        'tg-secondary-grey': 'var(--tg-secondary-grey)',
        'tg-secondary-dark': 'var(--tg-secondary-dark)',
        'tg-secondary-deepdark': 'var(--tg-secondary-deepdark)',
        'tg-primary-success': 'var(--tg-primary-success)',
        'tg-primary-fail': 'var(--tg-primary-fail)',
        'tg-button-secondary-main': 'var(--tg-button-secondary-main)',
        'tg-bet-slip-error': 'var(--tg-bet-slip-error)',
        'tg-bet-button-deepblue': 'var(--tg-bet-button-deepblue)',
        'tg-sub-info': 'var(--tg-sub-info)',
        'tg-sub-deepblue': 'var(--tg-sub-deepblue)',
        'tg-sub-blue': 'var(--tg-sub-blue)',
        'tg-sub-lightblue': 'var(--tg-sub-lightblue)',
        'tg-sub-green': 'var(--tg-sub-green)',
        'tg-sub-green-deep': 'var(--tg-sub-green-deep)',
        'tg-sub-green-light': 'var(--tg-sub-green-light)',
        'tg-text-white': 'var(--tg-text-white)',
        'tg-text-black': 'var(--tg-text-black)',
        'tg-text-black-secondary': 'var(--tg-text-black-secondary)',
        'tg-text-error': 'var(--tg-text-error)',
        'tg-text-error-sub': 'var(--tg-text-error-sub)',
        'tg-text-warn': 'var(--tg-text-warn)',
        'tg-text-warn-sub': 'var(--tg-text-warn-sub)',
        'tg-text-green': 'var(--tg-text-green)',
        'tg-text-green-light': 'var(--tg-text-green-light)',
        'tg-text-pink': 'var(--tg-text-pink)',
        'tg-text-blue': 'var(--tg-text-blue)',
        'tg-text-lightblue': 'var(--tg-text-lightblue)',
        'tg-text-dark': 'var(--tg-text-dark)',
        'tg-text-grey-deep': 'var(--tg-text-grey-deep)',
        'tg-text-grey': 'var(--tg-text-grey)',
        'tg-text-grey-light': 'var(--tg-text-grey-light)',
        'tg-text-grey-lighter': 'var(--tg-text-grey-lighter)',
        'tg-text-grey-secondary': 'var(--tg-text-grey-secondary)',
        'tg-text-placeholder': 'var(--tg-text-placeholder)',
        'tg-text-green-deep': 'var(--tg-text-green-deep)',
        'tg-text-purple': 'var(--tg-text-purple)',
        'tg-text-lightgrey': 'var(--tg-text-lightgrey)',
        'tg-text-secondary-main': 'var(--tg-text-secondary-main)',
        'tg-text-grey-button': 'var(--tg-text-grey-button)',
        'tg-color-black-rgb': 'var(--tg-color-black-rgb)',
        'tg-color-white-rgb': 'var(--tg-color-white-rgb)',
        'tg-color-grey-rgb': 'var(--tg-color-grey-rgb)',
        'tg-color-blue-rgb': 'var(--tg-color-blue-rgb)',
        'tg-color-green-rgb': 'var(--tg-color-green-rgb)',
        'tg-border-color-grey': 'var(--tg-border-color-grey)',
        'tg-secondary-border-color-grey': 'var(--tg-secondary-border-color-grey)',
        'tg-border-color-deep-grey': 'var(--tg-border-color-deep-grey)',
        'tg-border-color-main': 'var(--tg-border-color-main)',
        'tg-popper-bg': 'var(--tg-popper-bg)',
        'tg-popper-bg-deep': 'var(--tg-popper-bg-deep)',
        'tg-popper-color-default': 'var(--tg-popper-color-default)',
        'tg-popper-hover-color-default': 'var(--tg-popper-hover-color-default)',
        'tg-popper-color-bright': 'var(--tg-popper-color-bright)',
        'tg-popper-color-icon-default': 'var(--tg-popper-color-icon-default)',
        'tg-skeleton-color1': 'var(--tg-skeleton-color1)',
        'tg-skeleton-color2': 'var(--tg-skeleton-color2)',
      },
      spacing: Array.from({ length: 2000 }, (_, i) => `${i}px`),
      containers: {
        lg: '1000px',
      },
      boxShadow: {
        'text-shadow': 'var(--tg-text-shadow)',
      },
    },
  },
  plugins: [
    require('@tailwindcss/container-queries'),
  ],
}
