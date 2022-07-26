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
  if (process.env.REMOTE_BROWSER) {
    return puppeteer.connect({
      browserWSEndpoint:
        "ws://localhost:3000?--no-sandbox&--disable-setuid-sandbox&--disable-web-security",
    });
  }

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

    try {
      await page.setViewport({
        deviceScaleFactor: 1,
        width: 640,
        height: 480,
      });

      await page.setContent(html);
      await page.waitForNetworkIdle();
      await page.waitForSelector("#preview");

      const canvas = await page.$("#preview");

      await canvas.screenshot({
        path: outputPath,
        omitBackground: true,
      });
    } catch (err) {
      reject(err);
    }

    resolve(`Saved to ${outputPath}`);
  }).finally(() => (opts.browser ? context.close() : browser.close()));
}

module.exports = { convert, launch };
