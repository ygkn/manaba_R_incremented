/* eslint-disable @typescript-eslint/no-var-requires */
const DARK_THEME = require('./styles/dark-theme.css').default;
const LIGHT_THEME = require('./styles/light-theme.css').default;

export const modify = () => {
  const theme = localStorage.getItem('theme') as 'dark' | 'light' | null;

  if (!theme) {
    localStorage.setItem('theme', 'dark');
  }

  if (theme === 'dark') {
    localStorage.setItem('theme', 'light');
  } else if (theme === 'light') {
    localStorage.setItem('theme', 'dark');
  }

  const appendedHTMLStyleElement = document.getElementById('theme-style');
  if (appendedHTMLStyleElement) {
    appendedHTMLStyleElement.innerHTML =
      theme === 'dark' ? DARK_THEME : LIGHT_THEME;
  } else {
    const style = document.createElement('style');
    style.innerText = theme === 'dark' ? DARK_THEME : LIGHT_THEME;
    style.id = 'theme-style';
    document.head.appendChild(style);
  }
};
