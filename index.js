const renderText = require("puppeteer-render-text");

const fonts = {
  Agata:
    "https://creazilla-store.fra1.digitaloceanspaces.com/fonts/3451956/agata-medium-font-original.ttf",
  "Keele Decorated":
    "https://creazilla-store.fra1.digitaloceanspaces.com/fonts/3466336/keele-decorated-regular-font-original.ttf",
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
