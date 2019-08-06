/*
 * @Author: bruce.lc
 * @Date: 2019-08-05 19:34:47
 * @Last Modified by: bruce.lc
 */
const fs = require('fs');
// node.js 命令行接口的完整解决方案
// 官网地址 https://github.com/tj/commander.js/blob/master/Readme_zh-CN.md
const program = require('commander');

// 从github,lab获取其他仓库下载模版代码
const download = require('download-git-repo');

// js模版引擎, 类似于jade ejs swig
const handlebars = require('handlebars');

// NodeJs 交互式命令行工具
// 地址 https://juejin.im/entry/5937c73cac502e0068cf1171
const inquirer = require('inquirer');

// 实现node.js 命令行环境的 loading效果， 和显示各种状态的图标等
const ora = require('ora');

// 修改控制台中字符串的样式 字体样式(加粗、隐藏等) 字体颜色 背景颜色
const chalk = require('chalk');

// 为各种日志级别提供着色的符号 错误正确警示
const symbols = require('log-symbols');

// 开始
const downloadFunc = (name) => {
    if(!fs.existsSync(name)){
        inquirer.prompt([
            {
                name: 'description',
                message: '请输入项目描述'
            },
            {
                name: 'author',
                message: '请输入作者名称'
            }
        ]).then((answers) => {
            const spinner = ora('正在下载模板...');
            spinner.start();
            // name是第二个参数,下载路径
            download('direct:http://gitlab.alibaba-inc.com/alipic/aoneChart.git#master', name, {clone: true}, (err) => {
                if(err){
                    spinner.fail();
                    console.log(symbols.error, chalk.red(err));
                }else{
                    spinner.succeed();
                    const fileName = `${name}/package.json`;
                    const meta = {
                        name,
                        description: answers.description,
                        author: answers.author
                    }
                    if(fs.existsSync(fileName)){
                      // 对源文件的package.json进行处理
                      const content = fs.readFileSync(fileName).toString();
                      const result = handlebars.compile(content)(meta);
                      fs.writeFileSync(fileName, result);
                    }
                    console.log(symbols.success, chalk.green('项目初始化完成'));
                }
            })
        })
    }else{
        // 错误提示项目已存在，避免覆盖原有项目
        console.log(symbols.error, chalk.red('项目已存在'));
    }
}

module.exports = downloadFunc;


























// program.version('1.0.0', '-v, --version') // 将 -v 和 –version 添加到命令中，可以通过这些选项打印出版本号。
//     .command('init <name>')
//     .action((name) => {
//         if(!fs.existsSync(name)){
//             inquirer.prompt([
//                 {
//                     name: 'description',
//                     message: '请输入项目描述'
//                 },
//                 {
//                     name: 'author',
//                     message: '请输入作者名称'
//                 }
//             ]).then((answers) => {
//                 const spinner = ora('正在下载模板...');
//                 spinner.start();
//                 // name是第二个参数,下载路径
//                 download('direct:http://gitlab.alibaba-inc.com/alipic/aoneChart.git#master', name, {clone: true}, (err) => {
//                     if(err){
//                         spinner.fail();
//                         console.log(symbols.error, chalk.red(err));
//                     }else{
//                         spinner.succeed();
//                         const fileName = `${name}/package.json`;
//                         const meta = {
//                             name,
//                             description: answers.description,
//                             author: answers.author
//                         }
//                         if(fs.existsSync(fileName)){
//                           // 对源文件的package.json进行处理
//                           const content = fs.readFileSync(fileName).toString();
//                           const result = handlebars.compile(content)(meta);
//                           fs.writeFileSync(fileName, result);
//                         }
//                         console.log(symbols.success, chalk.green('项目初始化完成'));
//                     }
//                 })
//             })
//         }else{
//             // 错误提示项目已存在，避免覆盖原有项目
//             console.log(symbols.error, chalk.red('项目已存在'));
//         }
//     })
// program.parse(process.argv);

// 参考链接 https://blog.csdn.net/VhWfR2u02Q/article/details/80650106