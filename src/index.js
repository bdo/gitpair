#!/usr/bin/env node

const gitHook = require("./gitHook.js")
const help = require("./help.js")
const ArgParse = require("argparse")

const packageJson = require("./package.json")


switch (argv[1]) {
  case "install":
      // Install the githook directly into .git

  case "help":
      // Display some help text
      help()
      break;

  default:
    // Run the githook
    const parser = new ArgParse.ArgumentParser({
      addHelp: true
    })

    parser.addArgument(
      ["p", "path"],
      {
        help: "Set the path of .gitpair. Defaults to your home directory."
      }
    )

    const args = parser.parseArgs()

    gitHook(args);
}
