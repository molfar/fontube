const fs = require("fs/promises");
const puppeteer = require("puppeteer");
const Handlebars = require("handlebars");

function compile(templatePath, data) {
  return fs
    .readFile(templatePath)
    .then((d) => Handlebars.compile(d.toString()))
    .then((t) => t(data));
}

function launch() {
  return puppeteer.launch({
    args: [
      "--no-sandbox",
      "--disable-setuid-sandbox",
      "--disable-web-security",
    ],
  });
}

async function convert(opts) {
  const { templatePath, data, outputPath } = opts;
  const browser = opts.browser || (await launch());
  const context = await browser.createIncognitoBrowserContext();
  const page = await context.newPage();
  const html = await compile(templatePath, data);

  return new Promise(async (resolve, reject) => {
    page.on("console", (msg) => reject(`[${msg.type()}] ${msg.text()}`));

    await page.setViewport({
      deviceScaleFactor: 1,
      width: 640,
      height: 480,
    });

    await page.setContent(html);
    await page.waitForNetworkIdle();

    const canvas = await page.$("#preview");

    await canvas.screenshot({
      path: outputPath,
      omitBackground: true,
    });

    resolve(`Saved to ${outputPath}`);
  }).finally(() => (opts.browser ? context.close() : browser.close()));
}

module.exports = { convert, launch };
