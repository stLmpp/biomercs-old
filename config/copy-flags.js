const copydir = require('copy-dir');
const { readdir, rename, unlink, writeFile } = require('fs');

const noop = () => {};

const ASSETS = './src/assets/flags';
const ASSETS_SQUARED = `${ASSETS}/squared`;
const FLAGS_DIR = './node_modules/flag-icon-css/flags/4x3';
const FLAGS_DIR_SQUARED = './node_modules/flag-icon-css/flags/1x1';

readdir(ASSETS, (err, files) => {
  for (const file of files) {
    unlink(`${ASSETS}/${file}`, noop);
  }
  readdir(ASSETS_SQUARED, (err, files) => {
    for (const file of files) {
      unlink(`${ASSETS_SQUARED}/${file}`, noop);
    }
    copyFlags();
  });
});

function copyFlags() {
  copydir(FLAGS_DIR, ASSETS, err => {
    if (err) {
      console.log(err);
    } else {
      copydir(FLAGS_DIR_SQUARED, ASSETS_SQUARED, err => {
        if (err) {
          console.log(err);
        } else {
          console.log('Flags copied!');
          renameFiles();
        }
      });
    }
  });
}

function renameFiles() {
  const JSON_CONFIG = {
    regular: [],
    squared: [],
  };
  readdir(ASSETS, (err, files) => {
    for (const filename of files) {
      if (filename.includes('.svg')) {
        const newFilename = `flag-${filename}`;
        rename(`${ASSETS}/${filename}`, `${ASSETS}/${newFilename}`, () => {
          JSON_CONFIG.regular.push({
            name: newFilename.replace('.svg', ''),
            path: `${ASSETS.replace('/src', '')}/${newFilename}`,
          });
        });
      }
    }
    readdir(ASSETS_SQUARED, (err, files) => {
      for (let i = 0, len = files.length; i < len; i++) {
        const filename = files[i];
        if (filename.includes('.svg')) {
          const newFilename = `flag-${filename.replace(
            '.svg',
            ''
          )}-squared.svg`;
          rename(
            `${ASSETS_SQUARED}/${filename}`,
            `${ASSETS_SQUARED}/${newFilename}`,
            () => {
              JSON_CONFIG.regular.push({
                name: newFilename.replace('.svg', ''),
                path: `${ASSETS_SQUARED.replace('/src', '')}/${newFilename}`,
              });
              if (i === files.length - 1) {
                writeFile(
                  `${ASSETS}/config.json`,
                  JSON.stringify(JSON_CONFIG),
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
            }
          );
        }
      }
    });
  });
}
