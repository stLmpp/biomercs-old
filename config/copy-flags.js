const copydir = require('copy-dir');
const { readdir, rename, unlink, writeFile } = require('fs');

const noop = () => {};

const ASSETS = './src/assets/flags';
const FLAGS_DIR = './node_modules/flag-icon-css/flags/4x3';

readdir(ASSETS, (err, files) => {
  for (const file of files) {
    unlink(`${ASSETS}/${file}`, noop);
  }
  copyFlags();
});

function copyFlags() {
  copydir(FLAGS_DIR, ASSETS, err => {
    if (err) {
      console.log(err);
    } else {
      renameFiles();
    }
  });
}

function renameFiles() {
  const JSON_CONFIG = [];
  readdir(ASSETS, (err, files) => {
    for (let i = 0, len = files.length; i < len; i++) {
      const filename = files[i];
      if (filename.includes('.svg')) {
        const newFilename = `flag-${filename}`;
        rename(`${ASSETS}/${filename}`, `${ASSETS}/${newFilename}`, () => {
          JSON_CONFIG.push({
            name: newFilename.replace('.svg', ''),
            path: `${ASSETS.replace('/src', '')}/${newFilename}`,
          });
          if (i === files.length - 1) {
            writeFile(
              `${ASSETS}/config.js`,
              `export const flagIcons = ${JSON.stringify(JSON_CONFIG)}`,
              'utf8',
              err => {
                if (err) {
                  console.log(err);
                } else {
                  console.log('Flags config file created');
                }
              }
            );
          }
        });
      }
    }
  });
}
