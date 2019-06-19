const package = require("../package.json");
const execSync = require("child_process").execSync;

const version = package.version;
const name    = package.name;

console.log(`Publishing ${name} v${version}`);
console.log(`Adding latest tag`);
execSync(`npm dist-tag add ${name}@${version} latest`);
console.log(`Removing beta tag`);
execSync(`npm dist-tag rm ${name}@${version} beta`);
console.log(`${name} was published`);