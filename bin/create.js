/*
 * @Author: bruce.lc
 * @Date: 2019-08-05 19:39:45
 * @Last Modified by: bruce.lc
 */
const program = require('commander');
const path = require('path');
const fs = require('fs-extra');

const generates = require('../utils/generate');
const common = require('../utils/common');
const {
  findPkgPath,
  createComponent,
  createRoute,
} = generates;

const {
  message,
  paramsToObj,
} = common;

const createFunc = (type, name, otherParams = []) => {
  const acceptList = ['component', 'route']; // 创建文件的类型
  console.log('type', type, name);
  if (!acceptList.find(item => item === type)) {
    message.light('create type must one of [component | route]');// message封装的console
    process.exit(); // 强制进程尽快退出
  }
  const params = paramsToObj(otherParams); // 把数组转化为对象
  params.name = name || 'example';

  generate({
    type,
    params
  });
}


  //生成文件入口函数
function generate({type, params}) {
  const pkgPath = findPkgPath(process.cwd())
  if (!pkgPath) {
    message.error('No \'package.json\' file was found for the project.')
    process.exit()
  }
  const dist = path.join(pkgPath, `./src/${type}s`); // path 片段连接到一起
  console.log('params', dist, params);

  fs
    .ensureDir(dist) // 确定dist目录存在, 如果不存在就创建一个, 是异步的, fs-extra封装的
    .then(() => {
      switch (type) {
        case 'component':
          createComponent(dist, params);
          break;

        case 'route':
          createRoute(dist, params);
          break;

        default:
          break;
      }
    })
    .catch(err => {
      console.log(err);
      process.exit(1);
    });
}

module.exports = createFunc;





// command 第一个参数为命令名称, alias为命令的别称
// 其中<>包裹的为必选参数 []为选填参数 带有...的参数为剩余参数的集合
// program
//   .command('create <type> [name] [otherParams...]')
//   .alias('c')
//   .description('Generates new code')
//   .action(function (type, name, otherParams) {
//     const acceptList = ['component', 'route']; // 创建文件的类型
//     console.log('type', type);
//     if (!acceptList.find(item => item === type)) {
//       message.light('create type must one of [component | route]');// message封装的console
//       process.exit(); // 强制进程尽快退出
//     }
//     const params = paramsToObj(otherParams); // 把数组转化为对象
//     params.name = name || 'example';

//     generate({
//       type,
//       params
//     });
//   });


// program.parse(process.argv); // 处理所有参数执行
