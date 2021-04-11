/* eslint-disable @typescript-eslint/no-var-requires */
const DARK_THEME = require('./styles/dark-mode.css').default;
const LIGHT_THEME = require('./styles/light-mode.css').default;

export const modify = (modifyDarkMode: boolean) => {
  const appendedHTMLStyleElement = document.getElementById('theme-style');
  if (appendedHTMLStyleElement) {
    appendedHTMLStyleElement.innerHTML = modifyDarkMode
      ? DARK_THEME
      : LIGHT_THEME;
  } else {
    const style = document.createElement('style');
    style.innerText = modifyDarkMode ? DARK_THEME : LIGHT_THEME;
    style.id = 'theme-style';
    document.head.appendChild(style);
  }
};
