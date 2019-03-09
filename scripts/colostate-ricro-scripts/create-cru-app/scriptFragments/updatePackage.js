const fs = require('fs');
const Shell = require('shelljs');

/**
 * Update CRA package.json
 */
const updatePackage = ({ args, options, script }) => {
  const packageScriptName = 'package.json';
  // eslint-disable-next-line no-console
  console.log(`\n${script.color('shelljs', script.maskSpace({ value: packageScriptName }))}`);

  const packagePath = `${args.dir}package.json`;
  const packageJson = JSON.parse(fs.readFileSync(packagePath, 'utf8'));

  Object.keys(options).forEach(argKey => {
    if (argKey.includes('package__')) {
      const packageKey = argKey.split('package__')[1];
      packageJson[packageKey] = args[argKey] || packageJson[packageKey];
    }
  });
  packageJson.private = args.package__private;

  new Shell.ShellString(JSON.stringify(packageJson, null, 2)).to(packagePath);
  if (Shell.error()) {
    script.log(
      `${script.color('error', 'An error occured. See above output for debugging.')}\n`,
      packageScriptName,
      this.color_shelljs,
    );
    Shell.exit(1);
  }
  script.log(
    `${script.color('success', `Successfully updated \`package.json\` in \`${packagePath}\``)}`,
    packageScriptName,
    script.color_shelljs,
  );
};

module.exports = updatePackage;
