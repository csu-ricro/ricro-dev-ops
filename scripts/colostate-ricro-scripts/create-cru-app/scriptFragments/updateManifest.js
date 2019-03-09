const fs = require('fs');
const Shell = require('shelljs');
const manifestFragment = require('../assets/manifest.js');

/**
 * Merge manifest from CRA (`args.dir`) with manifest fragment in assets.
 * Write new manifest to `args.dir` manifest
 */
const updateManifest = ({ args, script }) => {
  const manifestScriptName = 'manifest.json';
  // eslint-disable-next-line no-console
  console.log(`\n${script.color('shelljs', script.maskSpace({ value: manifestScriptName }))}`);

  const manifestPath = `${args.dir}public/manifest.json`;

  const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));

  Object.keys(manifestFragment).forEach(key => {
    manifest[key] = manifestFragment[key];
  });
  manifest.name = args.manifest__name;
  manifest.short_name = args.manifest__short_name;

  new Shell.ShellString(JSON.stringify(manifest, null, 2)).to(manifestPath);
  if (Shell.error()) {
    script.log(
      `${script.color('error', 'An error occured. See above output for debugging.')}\n`,
      manifestScriptName,
      this.color_shelljs,
    );
    Shell.exit(1);
  }
  script.log(
    `${script.color('success', `Successfully updated \`manifest.json\` in \`${manifestPath}\``)}`,
    manifestScriptName,
    script.color_shelljs,
  );
};

module.exports = updateManifest;
