const gitHook = require("./gitHook.js");
const install = require("./install.js");
const init = require("./init.js");
const ArgParse = require("argparse");

const packageJson = require("../package.json");

const parser = new ArgParse.ArgumentParser({
  name: packageJson.name,
  version: packageJson.version,
  addHelp: true
});


const subparsers = parser.addSubparsers({ dest: "command" })

const wizard = subparsers.addParser("init", { dest: "init", description: "Create a local .gitpair file", addHelp: true })

const installer = subparsers.addParser("install", { dest: "install", description: "Install script as a git hook in your .git/hooks directory.", addHelp: true })
installer.addArgument(
  ["-u", "--uninstall"],
  {
    nargs: 0,
    help: "Remove the .git/hook/post-commit script."
  }
);
installer.addArgument(
  ["-p", "--path"],
  {
    help: "Set the path of .gitpair. Defaults to the directory containing your package.json, or your home directory."
  }
);


const hook = subparsers.addParser("hook", { dest: "hook", description: "Run the git hook commit transformer.", addHelp: true })
hook.addArgument(
  ["-p", "--path"],
  {
    help: "Set the path of .gitpair. Defaults to the directory containing your package.json, or your home directory."
  }
);


const args = parser.parseArgs();
switch(args.command) {
  case "init":
    init(args);
    break;

  case "install":
    install(args);
    break;

  case "hook":
    gitHook(args);
    break;
}
