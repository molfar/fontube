const { convert } = require("./lib/convert");
const fixtures = require("./fixtures.json");
const path = require("path");

for (const [family, url] of Object.entries(fixtures)) {
  convert("editor", path.join("previews", `${family}.png`), {
    text: family,
    url,
    family,
  }).then(console.log);
}
