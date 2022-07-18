const { convert, launch } = require("./lib/convert");
const fixtures = require("./fixtures.json");
const path = require("path");
const fs = require("fs");

fs.readdirSync("./previews")
  .filter((f) => f.endsWith(".png"))
  .forEach((f) => fs.rmSync(path.join("./previews", f)));

const templates = fs.readdirSync("./templates");
const tasks = [];

launch().then((browser) => {
  for (const template of templates) {
    const templatePath = path.join("./templates", template);
    const variant = path.basename(template, ".hbs");

    for (const [family, url] of Object.entries(fixtures)) {
      const outputPath = path.join("./previews", `${variant} - ${family}.png`);

      const data = {
        text: family,
        url,
        family,
      };

      tasks.push(
        convert({ templatePath, data, outputPath, browser })
          .then(console.log)
          .catch(console.error)
      );
    }
  }

  Promise.all(tasks).finally(() => browser.close());
});
