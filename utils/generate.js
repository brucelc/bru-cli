/*
 * @Author: bruce.lc
 * @Date: 2019-08-05 20:50:38
 * @Last Modified by: bruce.lc
 */
const fs = require('fs-extra');
const path = require('path');
const common = require('./common'); // 公共方法, 比如写入文件等
const templatePath = '../template/'; // 模版文件, 用于复制或其他操作的模板
const stateFile = 'State.st';
const statelessFile = 'Stateless.st';
const routeFile = 'route.st';
const modelFile = 'model.st';
const styleFile = 'style.st';
const {
  copyTemplate,
  write,
  mkdir,
  message,
  sep,
  exportCodeGenerator,
  camelCaseFn,
  getFileName,
} = common;

function createComponent(dir, params) {
  console.log('create', dir, params);

  const cmName = params.name;
  const cmNameUppercase = camelCaseFn(cmName); // 转为驼峰命名
  const cmPath = `${dir}${sep}${cmNameUppercase}`; // 组合文件夹路径

  console.log('cmPath', cmNameUppercase, cmPath);

  // 生成文件名字 index.tsx
  const fileName = getFileName({ name: 'index', suffix: 'tsx' });

  // 区分有状态组件和无状态组件
  const templateFile = params.state ? stateFile : statelessFile;
  const content = params.content || 'Jsm component';
  if(fs.existsSync(cmPath)) {
    message.error(`the ${cmName} component exist!`)
    process.exit();
  } else {
    fs
    .ensureDir(cmPath)
    .then(() => {
      copyTemplate(`${templatePath}${templateFile}`, `${cmPath}/${fileName}`, {
        name: cmNameUppercase,
        content,
      });
      message.success('Create component success!');
      message.success(` cd to '${cmPath}' check it`);
      try {
        // 通过同步的方式将文本内容或数据添加到文件里，文件不存在则自动创建。
        fs.appendFileSync(`${dir}${sep}/index.ts`,
        exportCodeGenerator('component', {
          name: cmName, uppercaseName: cmNameUppercase
        }));
      } catch (error) {
        message.error('Can\'t append to index.ts file, maybe this file non-existent!')
      } finally {
        process.exit(0); // 退出进程
      }
    })
    .catch(err => {
      console.log(err);
      process.exit(1);
    });
  }
}

function createRoute(dir, params) {
  const namespace = params.name;
  const namespaceUppercase = camelCaseFn(namespace);
  const routePath = `${dir}${sep}${namespaceUppercase}`;
  const routeName = getFileName({name: 'index', suffix: 'tsx'});
  const styleName = getFileName({name: 'style', suffix: 'less'});
  const modelName = getFileName({name: 'model', suffix: 'ts'});
  const content = params.content || 'Jsm route';
  if(fs.existsSync(routePath)) {
    message.error(`the ${namespace} route exist!`)
    process.exit();
  } else {
    fs
    .ensureDir(routePath)
    .then(() => {
      // 拷贝route模版
      copyTemplate(`${templatePath}${routeFile}`, `${routePath}/${routeName}`, {
        ...params,
        name: camelCaseFn(namespace).split('.')[0],
        namespace,
        content,
      });
      // 拷贝model
      copyTemplate(`${templatePath}${modelFile}`, `${routePath}/${modelName}`, {
        ...params,
        namespace,
      });

      // 拷贝style
      copyTemplate(`${templatePath}${styleFile}`, `${routePath}/${styleName}`, {
        ...params,
      });

      message.success('Create route success!');
      message.success(` cd to '${routePath}' check it`);
      console.log();

      try {
        const rootModelFile = path.join(path.dirname(dir), './model.ts');
        console.log(rootModelFile)
        fs.appendFileSync(rootModelFile, exportCodeGenerator('model', {  name: namespace, uppercaseName: namespaceUppercase }));
      } catch (error) {
        message.error('Can\'t append to model.ts file, maybe this file non-existent!')
      } finally {
        process.exit(0)
      }
    })
    .catch(err => {
      console.log(err);
      process.exit(1);
    });
  }
}

function findPkgPath (dir) {
  if (dir.split(path.sep).length === 2) return ''
  const pkg = path.join(dir, './package.json')
  let pkgPath = ''
  try {
    if (fs.existsSync(pkg)) {
      return dir;
    } else {
      pkgPath = findPkgPath(path.dirname(dir))
    }
  } catch (error) {
    console.log(error)
    process.exit(1)
  }
  return pkgPath
}

module.exports = {
  createComponent,
  createRoute,
  findPkgPath,
};