const { launch, compile, convert } = require("./lib/convert");
const fixtures = require("./fixtures.json");
const path = require("path");
const fs = require("fs");

fs.readdirSync("./previews")
  .filter((f) => f.endsWith(".png"))
  .forEach((f) => fs.rmSync(path.join("./previews", f)));

launch().then(async (browser) => {
  const templates = fs.readdirSync("./templates");
  const tasks = [];

  for (const template of templates) {
    const templatePath = path.join("./templates", template);
    const variant = path.basename(template, ".hbs");

    for (const [family, url] of Object.entries(fixtures)) {
      const outputPath = path.join("./previews", `${variant} - ${family}.png`);

      const task = Promise.all([
        compile(templatePath, {
          text: family,
          url,
          family,
        }),
        browser.createIncognitoBrowserContext(),
      ])
        .then(([html, context]) => convert(context, html, outputPath))
        .then(console.log)
        .catch(console.error);

      tasks.push(task);
    }
  }

  Promise.all(tasks).finally(() => browser.close());
});
