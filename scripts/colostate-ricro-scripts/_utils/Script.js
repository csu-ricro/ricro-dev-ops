/* eslint-disable no-console */
const sh = require('shelljs');
const chalk = require('chalk');

const tab = '    ';
module.exports = class Script {
  constructor({
    colorBody = chalk.blue.bold,
    colorDebug = chalk.black.bgCyan,
    colorError = chalk.black.red,
    colorHeader = chalk.white.bgBlue.bold,
    colorShelljs = chalk.black.bgMagenta,
    colorSuccess = chalk.green,
    colorVersion = chalk.blue.bold,
    colorWarn = chalk.yellow,
    description,
    dryRun,
    name,
    pk,
    shelljsScripts,
  }) {
    this.color_body = colorBody;
    this.color_debug = colorDebug;
    this.color_header = colorHeader;
    this.color_shelljs = colorShelljs;
    this.color_version = colorVersion;

    this.color_error = colorError;
    this.color_success = colorSuccess;
    this.color_warn = colorWarn;

    this.description = description;
    this.dryRun = dryRun || false;
    this.name = name;
    this.package = pk;
    this.shelljsScriptsArray = this.shelljsScriptsSet(shelljsScripts);

    this.header = `${tab}${this.package.name}@${this.package.version} - ${this.name}${tab}`;

    this.scripts = {
      exec: this.shelljsScriptsExec.bind(this),
      get: this.shelljsScriptsGet.bind(this),
      set: this.shelljsScriptsSet.bind(this),
    };
  }

  start() {
    console.log(this.color_header(this.header));
    this.log(this.description);
  }

  stop() {
    console.log();
    this.log(this.color_success(`${this.name} successful!`));
    console.log();
  }

  color(color, colorArgs) {
    return this[`color_${color.toLowerCase()}`](colorArgs);
  }

  log(logString, scriptName, scriptColor = this.color_header) {
    // eslint-disable-next-line no-console
    const header = this.color_header(`[${this.name}]`);
    const script = scriptName ? scriptColor(`[${scriptName}]`) : '';
    console.log(`${header}${script}${tab}${this.color_body(logString)}`);
  }

  maskSpace({ mask = this.header, value }) {
    if (value.length >= mask.length) {
      return value;
    }
    const maskValueLength = mask.length - value.length;
    mask = mask.replace(/./g, ' ').substring(0, Math.floor(maskValueLength / 2));
    return mask + value + mask + (maskValueLength % 2 !== 0 ? ' ' : '');
  }

  shelljsScriptsExec(shelljsScriptsArray = this.shelljsScriptsArray) {
    // console.log();
    shelljsScriptsArray.forEach(script => {
      let scriptName = '';
      if (script.func) {
        script.args = Array.isArray(script.args) ? script.args : [script.args];
        const { func, args } = script;
        scriptName = script.name || `shelljs.${func}()`;
        console.log(`\n${this.color_shelljs(this.maskSpace({ value: scriptName }))}`);
        if (!this.dryRun) sh[func](...args);
      } else {
        scriptName = script.name || script.exec || script;
        console.log(`\n${this.color_shelljs(this.maskSpace({ value: scriptName }))}`);
        if (!this.dryRun) sh.exec(script.exec || script);
      }

      if (sh.error()) {
        this.log(
          `${this.color_error('An error occured. See above output for debugging.')}\n`,
          scriptName,
          this.color_shelljs,
        );
        sh.exit(1);
      }
      this.log(`${this.color_success('Success')}\n`, scriptName, this.color_shelljs);
    });
  }

  shelljsScriptsGet() {
    return this.shelljsScriptsArray;
  }

  shelljsScriptsSet(shelljsScriptsArray) {
    this.shelljsScriptsArray = Array.isArray(shelljsScriptsArray)
      ? shelljsScriptsArray
      : [shelljsScriptsArray];
  }
};
