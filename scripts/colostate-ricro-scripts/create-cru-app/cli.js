#! /usr/bin/env node

/* eslint-disable no-console */

const Commander = require('commander');
const Shell = require('shelljs');
const pk = require('../package.json');
const Script = require('../_utils/Script');
const updateHtml = require('./scriptFragments/updateHtml');
const updateManifest = require('./scriptFragments/updateManifest');
const updatePackage = require('./scriptFragments/updatePackage');

const scriptName = 'create-cru-app';

const options = {
  dir: ['-d --dir [path]', 'Specify the directory for app installation', '.'],
  manifest__name: [
    '-m --manifest__name [name]',
    'Set the `name` key in `manifest.json`',
    'Create App with colostate-ricro-ui',
  ],
  manifest__short_name: [
    '-M --manifest__short_name [shortName]',
    'Set the `short_name` key in `manifest.json`',
    'Create CRU App',
  ],
  package__author: [
    '-a --package__author [name]',
    'Set the `author` key in `package.json`',
    'RICRO',
  ],
  package__description: [
    '-D --package__description [description]',
    'Specify the `description` key in `package.json`',
    `App template built with colostate-ricro-scripts/${scriptName}`,
  ],
  package__homepage: [
    '-h --package__homepage [path]',
    'Specify the deployment path on the production server',
    '/',
  ],
  package__name: [
    '-n --package__name [name]',
    'Set the `name` key in `package.json`',
    'cru-template',
  ],
  package__private: ['-p, --package__private', 'Set the `private` key in `package.json` to `true`'],
};

const description = 'Create a new RICRO app with create-react-app and colostate-ricro-ui';
const args = Commander.version(pk.version, '-v, --version').description(description);
Object.keys(options).forEach(option => args.option(...options[option]));
args.parse(process.argv);

const script = new Script({
  // dryRun: 'true',
  name: scriptName,
  description,
  pk,
});

// Shell.exec('clear');
script.start();

if (!Shell.which('create-react-app')) {
  script.log(script.color('error', '`create-react-app` must be installed globally'));
  Shell.exit(1);
}

Object.keys(options).forEach(option => {
  if (args[option] && args[option] === options[option][2]) {
    script.log(script.color('warn', `\`${option}\`: Using default value: "${options[option][2]}"`));
  }
});

if (args.dir.charAt(args.dir.length - 1) !== '/') {
  args.dir += '/';
}

script.scripts.exec([{ name: 'create-react-app', exec: `create-react-app ${args.dir}` }]);
updateManifest({ args, script });
updateHtml({ args, script });
updatePackage({ args, options, script });

// /**
//  * Merge manifest from CRA (`args.dir`) with manifest fragment in assets.
//  * Write new manifest to `args.dir` manifest
//  */
// const manifestScriptName = 'manifest.json';
// console.log(`\n${script.color('shelljs', script.maskSpace({ value: manifestScriptName }))}`);

// const manifestPath = `${args.dir}public/manifest.json`;
// const manifestFragment = require('./assets/manifest.js');

// const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));

// Object.keys(manifestFragment).forEach(key => {
//   manifest[key] = manifestFragment[key];
// });
// manifest.name = args.manifest__name;
// manifest.short_name = args.manifest__short_name;

// new Shell.ShellString(JSON.stringify(manifest, null, 2)).to(manifestPath);
// if (Shell.error()) {
//   script.log(
//     `${script.color('error', 'An error occured. See above output for debugging.')}\n`,
//     manifestScriptName,
//     this.color_shelljs,
//   );
//   Shell.exit(1);
// }
// script.log(
//   `${script.color('success', `Successfully updated \`manifest.json\` in \`${manifestPath}\``)}`,
//   manifestScriptName,
//   script.color_shelljs,
// );

// /**
//  * Update CRA public/index.html
//  */
// const htmlHeadScriptName = 'index.html';
// console.log(`\n${script.color('shelljs', script.maskSpace({ value: htmlHeadScriptName }))}`);
// const createHtmlHeadFragment = require('./assets/htmlHead.js');

// const htmlHeadFragment = createHtmlHeadFragment({
//   title: `${args.manifest__short_name} - RICRO Apps`,
// });

// const htmlHeadPath = `${args.dir}public/index.html`;

// new Shell.ShellString(
//   fs.readFileSync(htmlHeadPath, 'utf8').replace(/<head>(?:.|\n|\r)+?<\/head>/, htmlHeadFragment),
// ).to(htmlHeadPath);

// if (Shell.error()) {
//   script.log(
//     `${script.color('error', 'An error occured. See above output for debugging.')}\n`,
//     htmlHeadScriptName,
//     this.color_shelljs,
//   );
//   Shell.exit(1);
// }
// script.log(
//   `${script.color('success', `Successfully updated \`index.html\` in \`${htmlHeadPath}\``)}`,
//   htmlHeadScriptName,
//   script.color_shelljs,
// );

// /**
//  * Update CRA package.json
//  */
// const packageScriptName = 'package.json';
// console.log(`\n${script.color('shelljs', script.maskSpace({ value: packageScriptName }))}`);

// const packagePath = `${args.dir}package.json`;
// const package = JSON.parse(fs.readFileSync(packagePath, 'utf8'));

// Object.keys(options).forEach(argKey => {
//   if (argKey.includes('package__')) {
//     const packageKey = argKey.split('package__')[1];
//     package[packageKey] = args[argKey] || package[packageKey];
//   }
// });
// package.private = args.package__private;

// new Shell.ShellString(JSON.stringify(package, null, 2)).to(packagePath);
// if (Shell.error()) {
//   script.log(
//     `${script.color('error', 'An error occured. See above output for debugging.')}\n`,
//     packageScriptName,
//     this.color_shelljs,
//   );
//   Shell.exit(1);
// }
// script.log(
//   `${script.color('success', `Successfully updated \`package.json\` in \`${packagePath}\``)}`,
//   packageScriptName,
//   script.color_shelljs,
// );

/**
 * Add dot-files
 */
const dotFiles = ['.eslintrc.js', 'prettier.config.js'];

const move = [];
dotFiles.forEach(dotFile => {
  move.push({
    name: `Copy ${dotFile}`,
    func: 'cp',
    args: [`${__dirname}/assets/dotFile-${dotFile}`, args.dir + dotFile],
  });
});
script.scripts.exec(move);

/**
 * Install dependencies
 */
const dependencies = 'colostate-ricro-ui';
const devDependencies = 'eslint-plugin-babel eslint-plugin-jest eslint-config-airbnb';

Shell.pushd('-q', args.dir);
script.scripts.exec([
  { name: 'Install deps', exec: `yarn add ${dependencies}` },
  { name: 'Install devDeps', exec: `yarn add -D ${devDependencies}` },
]);
Shell.popd('-q');

script.stop();
