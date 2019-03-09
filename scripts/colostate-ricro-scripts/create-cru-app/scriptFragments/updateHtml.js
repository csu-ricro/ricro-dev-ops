const fs = require('fs');
const Shell = require('shelljs');
const createHtmlHeadFragment = require('../assets/htmlHead.js');

/**
 * Update CRA public/index.html
 */
const updateHtml = ({ args, script }) => {
  const htmlHeadScriptName = 'index.html';
  // eslint-disable-next-line no-console
  console.log(`\n${script.color('shelljs', script.maskSpace({ value: htmlHeadScriptName }))}`);

  const htmlHeadFragment = createHtmlHeadFragment({
    title: `${args.manifest__short_name} - RICRO Apps`,
  });

  const htmlHeadPath = `${args.dir}public/index.html`;

  new Shell.ShellString(
    fs.readFileSync(htmlHeadPath, 'utf8').replace(/<head>(?:.|\n|\r)+?<\/head>/, htmlHeadFragment),
  ).to(htmlHeadPath);

  if (Shell.error()) {
    script.log(
      `${script.color('error', 'An error occured. See above output for debugging.')}\n`,
      htmlHeadScriptName,
      this.color_shelljs,
    );
    Shell.exit(1);
  }
  script.log(
    `${script.color('success', `Successfully updated \`index.html\` in \`${htmlHeadPath}\``)}`,
    htmlHeadScriptName,
    script.color_shelljs,
  );
};

module.exports = updateHtml;
