#!/usr/bin/env node
// 这种用法是为了防止操作系统用户没有将node装在默认的/usr/bin路径里。当系统看到这一行的时候，
// 首先会到env设置里查找node的安装路径，再调用对应路径下的解释器程序完成操作

const program = require('commander');

// 初始化命令
 program
  .command('create <type> [name] [otherParams]')
  .alias('cli')
  .description('Generates new code')
  .action(function (type, name, otherParams) {
    console.log('type', type, name, otherParams);
    // 在这里执行具体的操作
    switch(type) {
      case 'download':
        // 从仓库下载模版文件
        const downloadFunc = require('./download.js');
        downloadFunc(name);
        break;
      case 'create':
        // 命令行创建模板文件
        const createFunc = require('./create.js');
        createFunc(name, otherParams);
        break;
      default: return false;
    }
  });

program.parse(process.argv);





