const renderText = require("puppeteer-render-text");

const fonts = {
  Agata:
    "https://creazilla-store.fra1.digitaloceanspaces.com/fonts/3451956/agata-medium-font-original.ttf",
  "Keele Decorated":
    "https://creazilla-store.fra1.digitaloceanspaces.com/fonts/3466336/keele-decorated-regular-font-original.ttf",
  Gresham:
    "https://creazilla-store.fra1.digitaloceanspaces.com/fonts/3465128/gresham-regular-font-original.ttf",
  Forvertz:
    "https://creazilla-store.fra1.digitaloceanspaces.com/fonts/3452696/forvertz-regular-font-original.ttf",
  "KayZ Handwritting":
    "https://creazilla-store.fra1.digitaloceanspaces.com/fonts/3466330/kayz-handwritting-medium-font-original.ttf",
  Aaram:
    "https://creazilla-store.fra1.digitaloceanspaces.com/fonts/3451932/aaram-regular-font-original.ttf",
  "5by7":
    "https://creazilla-store.fra1.digitaloceanspaces.com/fonts/3451927/5by7-bold-font-original.ttf",
};

for (const [family, url] of Object.entries(fonts)) {
  renderText({
    text: family,
    output: `${family}.png`,
    style: {
      fontFamily: family,
      fontSize: 32,
      lineHeight: 1.5,
    },
    inject: {
      style: `@font-face { font-family: '${family}'; src: url('${url}'); }`,
    },
  }).then(() => console.log(`Ready ${family}`));
}
