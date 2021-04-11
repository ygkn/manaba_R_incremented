const DARK_THEME = `
*,
#myheader {
  background: #1a1a1a;
  color: #ffffff;
}

a,
a:link {
  color: #6084df !important;
}

.my-infolist-kinkyu .my-infolist-body tr .news-title a {
  color: #f86262;
}
`;

const LIGHT_THEME = `
*,
#myheader {
  background: #ffffff;
  color: #1a1a1a;
}

a,
a:link {
  color: #2449a8 !important;
}

.my-infolist-kinkyu .my-infolist-body tr .news-title a {
  color: #ff0000;
}
`;

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
