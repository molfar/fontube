#!/usr/bin/env node

const { program } = require("commander");
const { convert } = require("./lib/convert");
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

const { variant, output: outputPath, ...data } = program.opts();
const templatePath = path.resolve(__dirname, `./templates/${variant}.hbs`);

convert({ templatePath, data, outputPath }).then(console.log);
