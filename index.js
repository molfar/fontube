#!/usr/bin/env node

const { program } = require("commander");
const { convert } = require("./lib/convert");

program
  .name("fontube")
  .description("CLI to render fonts with headless browser")
  .version("1.0.0")
  .requiredOption("-v, --variant <name>", "Name of template file to use")
  .requiredOption("-o, --output <path>", "Output path for generated image")
  .requiredOption("-f, --family <name>", "Font family name")
  .requiredOption("-u, --url <path>", "Public accessible url to font source")
  .requiredOption(
    "-t, --text <string>",
    "Text to render (default to font family name)"
  );

program.parse();

const { variant, output, ...data } = program.opts();

convert(variant, output, data);
