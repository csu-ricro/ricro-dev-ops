const themeColor = '#1e4d2b';
const fontsLocation = '//static.colostate.edu/fonts';
const cacheVersion = '?v=2019-03-07T15:00:00';

const head = ({ title }) => {
  const lines = [
    '<meta charset="utf-8" />',
    '<meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />',
    `<meta name="msapplication-TileColor" content="${themeColor}">`,
    `<meta name="theme-color" content="${themeColor}">`,
    `<link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png${cacheVersion}">`,
    `<link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png${cacheVersion}">`,
    `<link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png${cacheVersion}">`,
    `<link rel="manifest" href="/site.webmanifest${cacheVersion}">`,
    `<link rel="mask-icon" href="/safari-pinned-tab.svg${cacheVersion}" color="${themeColor}">`,
    `<link rel="shortcut icon" href="/favicon.ico${cacheVersion}">`,
    '<link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons">',
    `<link rel="stylesheet" type="text/css" href="${fontsLocation}/factoria/factoria.css">`,
    `<link rel="stylesheet" type="text/css" href="${fontsLocation}/proxima-nova/proxima.css">`,
    '<!--',
    '    manifest.json provides metadata used when your web app is installed on a',
    "    user's mobile device or desktop.",
    '    See https://developers.google.com/web/fundamentals/web-app-manifest/',
    '-->',
    '<link rel="manifest" href="%PUBLIC_URL%/manifest.json" />',
    '<!--',
    '    Notice the use of %PUBLIC_URL% in the tags above.',
    '    It will be replaced with the URL of the `public` folder during the build.',
    '    Only files inside the `public` folder can be referenced from the HTML.',
    '',
    '    Unlike "/favicon.ico" or "favicon.ico", "%PUBLIC_URL%/favicon.ico" will',
    '    work correctly both with client-side routing and a non-root public URL.',
    '    Learn how to configure a non-root public URL by running `npm run build`.',
    '-->',
    `<title>${title}</title>`,
  ];

  let headString = '<head>';
  lines.forEach(el => {
    headString += `\n  ${el}`;
  });
  headString += '\n</head>';

  return headString;
};

module.exports = head;
