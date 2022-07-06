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

function convert(context, html, outputPath) {
  return context.newPage().then((page) => {
    return new Promise(async (resolve, reject) => {
      page.on("console", (cm) => {
        console.error(`[${cm.type()}] ${cm.text()}`);
      });

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

      await page.close();

      resolve(`Saved to ${outputPath}`);
    });
  });
}

module.exports = { compile, launch, convert };
