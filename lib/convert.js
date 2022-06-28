const fs = require("fs/promises");
const path = require("path");

const puppeteer = require("puppeteer");
const Handlebars = require("handlebars");

function compile(template, data) {
  return fs
    .readFile(
      path.resolve(__dirname, path.join("..", "templates", `${template}.hbs`))
    )
    .then((d) => Handlebars.compile(d.toString()))
    .then((t) => t(data));
}

function launch() {
  return puppeteer
    .launch({
      args: [
        "--no-sandbox",
        "--disable-setuid-sandbox",
        "--disable-web-security",
      ],
    })
    .then((b) => b.newPage());
}

function logger(msg) {
  console.log("[%s] %s", msg.type(), msg.text());
}

exports.convert = (variant, output, data) => {
  return Promise.all([launch(), compile(variant, data)]).then(
    async ([page, html]) => {
      page.on("console", logger);

      await page.setViewport({
        deviceScaleFactor: 1,
        width: 640,
        height: 480,
      });

      await page.setContent(html);
      await page.waitForNetworkIdle();

      const canvas = await page.$("#text");
      const screenshot = path.resolve(process.cwd(), output);

      await canvas.screenshot({
        path: screenshot,
        omitBackground: true,
      });

      await page.browser().close();

      return Promise.resolve(`${data.family} saved to ${screenshot}`);
    }
  );
};
