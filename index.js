const fs = require("fs");
const path = require("path");

const puppeteer = require("puppeteer");
const Handlebars = require("handlebars");

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

(async () => {
  const browser = await puppeteer.launch({
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });
  const page = await browser.newPage();
  await page.setViewport({
    deviceScaleFactor: 1,
    width: 640,
    height: 480,
  });

  const template = Handlebars.compile(
    fs.readFileSync(path.resolve(__dirname, "template.hbs")).toString()
  );

  for (const [family, url] of Object.entries(fonts)) {
    const data = { text: family, url, family };
    const html = await template(data);
    await page.setContent(html);
    const canvas = await page.$(".text");
    const screenshot = path.resolve(__dirname, "previews", `${family}.png`);
    await canvas.screenshot({
      path: screenshot,
      omitBackground: true,
    });
    await canvas.dispose();

    console.log("Ready", family, screenshot);
  }

  await browser.close();
})();
