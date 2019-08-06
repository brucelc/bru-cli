
const fs = require('fs-extra');
const os = require('os');
const path = require('path');
const chalk = require('chalk');

const sep = os.platform() === 'win32' ? '\\' : '/';

const message = {
  success (text) {
    console.log(chalk.green.bold(text));
  },
  error (text) {
    console.log(chalk.red.bold(text));
  },
  info (text) {
    console.log(chalk.blue.bold(text));
  },
  light (text) {
    console.log(chalk.yellow.bold(text));
  }
};


// 复制模板
function copyTemplate(from, to, renderData) {
  from = path.join(__dirname, from);
  if (renderData) {
    const originTemplate = fs.readFileSync(from, 'utf-8')
    const distFile = originTemplate.split(/[/s/S]*?\<\%\s*(\w+)\s*\%\>[/s/S]*?/im)
                                   .map(key => {
                                    return renderData[key] || key
                                   })
                                   .join('');
    write(to, distFile);
  } else {
    write(to, fs.readFileSync(from, 'utf-8'));
  }
}

function write(path, str) {
  fs.writeFileSync(path, str); // 写入文件
}

function mkdir(path, fn) {
  fs.mkdir(path, function(err) {
    fn && fn();
  });
}

function exportCodeGenerator(type, options) {
  let code = '';
  if (type === 'component') {
    code = `export { default as ${options.uppercaseName} } from './${options.uppercaseName}';\r\n`;
  } else {
    code = `export { default as ${options.name} } from './routes/${options.uppercaseName}/model';\r\n`;
  }
  return code
}

// 把数组转化为对象
function paramsToObj (paramsArr) {
  const params = {};
  paramsArr.forEach(item => {
      const kv = item.split('=')
      const key = kv[0]
      const value = kv[1] || kv[0]
      params[key] = value
    })
  return params;
};

// 驼峰命名
function camelCaseFn(str) {
  return `${str.slice(0, 1).toUpperCase()}${str.slice(1)}`;
}

function getFileName({name, camelCase, suffix = 'ts'}) {
  return camelCase ? `${camelCaseFn(name)}.${suffix}` : `${name}.${suffix}`;
}

module.exports = {
  copyTemplate,
  write,
  mkdir,
  message,
  sep,
  exportCodeGenerator,
  paramsToObj,
  camelCaseFn,
  getFileName,
};