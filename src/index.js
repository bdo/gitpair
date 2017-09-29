const ArgParse = require("argparse");

const scHook = require("./subcommands/hook.js");
const scInstall = require("./subcommands/install.js");
const scInit = require("./subcommands/init.js");


const packageJson = require("../package.json");
const parser = new ArgParse.ArgumentParser({
  name: packageJson.name,
  version: packageJson.version,
  addHelp: true
});


const subparsers = parser.addSubparsers({ dest: "command" })

const init = subparsers.addParser("init", { dest: "init", description: "Create a local .gitpair file", addHelp: true })

const install = subparsers.addParser("install", { dest: "install", description: "Install script as a git hook in your .git/hooks directory.", addHelp: true })
install.addArgument(
  ["-u", "--uninstall"],
  {
    nargs: 0,
    help: "Remove the .git/hook/post-commit script."
  }
);
install.addArgument(
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
    scInit(args);
    break;

  case "install":
    scInstall(args);
    break;

  case "hook":
    scHook(args);
    break;
}
