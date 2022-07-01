#!/usr/bin/env node

const { program } = require("commander");
const { Browser } = require("puppeteer");
const { launch, compile, convert } = require("./lib/convert");
const path = require("path");

program
  .name("fontube")
  .description("CLI to render fonts with headless browser")
  .version(process.env.npm_package_version)
  .requiredOption("-v, --variant <name>", "Name of template file to use")
  .requiredOption("-o, --output <path>", "Output path for generated image")
  .requiredOption("-f, --family <name>", "Font family name")
  .requiredOption("-u, --url <path>", "Public accessible url to font source")
  .requiredOption("-t, --text <string>", "Text to render");

program.parse();

const { variant, output, ...data } = program.opts();
const templatePath = path.join("./templates", `${variant}.hbs`);

Promise.all([
  compile(templatePath, data),
  launch().then((b) => b.defaultBrowserContext()),
]).then(([html, context]) =>
  convert(context, html, output)
    .then(console.log)
    .finally(() => context.browser().close())
);
