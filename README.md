# cli 工具
- 提供从仓库直接克隆模板项目
- 在已有项目的基础上通过命令行创建文件

# 本地开发

- node ./bin/init.js cli download myApp  从仓库直接克隆
- node ./bin/init.js cli create route Login 创建container文件
- node ./bin/init.js cli create compoent List 创建component文件

# 线上使用
全局安装: npm i bru-cli -g
bruce-cli cli download myApp 执行命令

## 搭建一个属于自己的脚手架

#### 好处
- 让项目从"搭建-开发-部署"更加快速以及规范
- 不要让自己成为码畜, 既要会写还要懂原理

#### 什么是脚手架?
- node.js相关api开发
- 命令式的构建项目（解析命令，拷贝项目到本地），提供项目的配置（构建，编译，代码规范检查）
- 比如用vue-cli生成了一个项目,下次如果还有类似的项目使用, 那如果是把代码copy一遍, 就显的太傻了, 最好的办法,就是通过sheel命令直接生成一个模版, 然后就直接可以业务开发了;无论是create-react-app,vue-cli,create-umi都是这样的套路

#### 常用的npm包
- commander：nodejs命令行接口的完整解决方案。
- inquirer：nodeJs 交互式命令行工具。
- handlebars：一个 javascript 语义话模版库。
- chalk：修改控制台中字符串的样式 字体样式(加粗、隐藏等) 字体颜色 背景颜色。
- download-git-repo：从github,lab获取其他仓库下载模版代码e。
- ora: 实现node.js 命令行环境的 loading效果， 和显示各种状态的图标等.

#### 创建项目
- npm init生成paackage.json文件
然后在项目根目录执行操作: mkdir bin && touch bin/jsm.js
在jsm.js文件中添加

    ```
    #!/usr/bin/env node
    console.log('Hello CLI')
    ```

- **#!/usr/bin/env node，告诉操作系统执行这个脚本的时候，调用/usr/bin下的node解释器**
- package.json文件只有加上了bin字段，才能在控制台使用你的命令，对应的这里的命令就是jsm，对应的执行文件为bin/jsm.js。 其实"jsm"命令就是 "node bin/jsm.js" 的别称，只有你用npm i -g tools全局安装后才可以用，开发的过程中直接用node bin/jsm.js即可

#### 解析命令
- 依赖 commander
- commander是一个轻巧的nodejs模块，提供了用户命令行输入和参数解析强大功能
- 关于commander的说明参考链接[api](https://github.com/tj/commander.js/blob/master/Readme_zh-CN.md)

    ```
    const program = require('commander');
     program
      .command('create <type> [name] [otherParams...]')
      .alias('c')
      .description('Generates new code')
      .action(function (type, name, otherParams) {
        console.log('type', type);
        console.log('name', name);
        console.log('other', otherParams);
        // 在这里执行具体的操作
      });

    program.parse(process.argv);
    ```

    **说明**

    - command第一个参数为命令名称，alias为命令的别称， 其中<>包裹的为必选参数 []为选填参数 带有...的参数为剩余参数的集合

    - 然后执行命令node bin/jsm.js c component myComponent state=1 title=HelloCLI
    输出的应该是下面的内容
    ![](media/15649332550967/15649343048994.jpg)


- ora: 实现node.js 命令行环境的 loading效果， 和显示各种状态的图标
- 想所有人都能下载。可以用http下载的方式,如果直接使用SSH地址, 会提示: 'git clone' failed with status 128

    ```
    download('direct:https://github.com/xxx/react-template.git', name, {clone: true}, (err) => {})
    ```



#### 文件操作
- 文件的操作，复制，粘贴，增加，删除，文件内容的新增，替换；可以借助fs-extra实现
- fs-extra是增强版的fs模块,模拟了类似如linux的命令

    ```
    root$ rm -rf /
    root$ mv tmpDir tmpNewDir
    root$ mkdir -p one/two
    root$ cp -r tmp tmpNew
    ```

#### 具体实现
1. npm init生成paackage.json文件
2. mkdir bin && touch bin/init.js
3. 在init.js添加 `#!/usr/bin/env node`

    ```
    const program = require('commander');

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
    ```

4. touch bin/create.js bin/download.js
5. download.js实现从git仓库下载模板脚手架到本地

    ```
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
                download('direct:http://gitlab.alibaba-inc.com/xxxx#master', name, {clone: true}, (err) => {
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
    ```

6. create.js实现创建模板文件, 具体代码,参见下面链接;

#### 发布到npm
- npm login 登陆, 没有账号,先注册账号
- 然后在项目根目录, npm publish发布
- 注意如果package.json中的name如果和已发布的包重复,会报403错误
- 然后就可以在使用了, 全局安装

    ```
        npm i xxxTools -g;
        xxxTools create myAPP;
    ```

#### Create-umi 创建项目
- 全局安装create-umi, 然后就可以使用yarn create umi生成项目脚手架
- 判断node版本,node版本必须8.0.0以上
- 根据提示选择要生成的项目类型,包括: ant-design-pro, app, block, library,plugin
- 根据选择的project类型,进入不同的generator
- 每个project的generator继承于公共的BasicGenerator,
- 单独的generator进行各自的业务操作,以app为例, 是否选择ts支持,是否选择antd,dva,dll等
- 所有选择完毕,开始进行文件操作
- 模板复制到指定目录, 写入之前配置的选项

#### vue-cli 创建项目

- cli3.0更加复杂, 当然功能也更加强大,比如vue create,vue add, vue serve, vue ui 等
- 项目初始化主要在 vue create命令中, 具体分析参看下文链接


#### Create-react-app 创建项目
- 主要包括2部分: 项目初始化和react-scripts
- 项目初始化就是我们输入 create-react-app project-name,到结束所做的事情, 而react-scripts所要做的包括start,test,eject,build以及各种webpack打包编译的工作
- 图解项目初始化
![](media/15649332550967/15650732633503.jpg)





### 引用

- [so easy 搭建前端脚手架](https://segmentfault.com/a/1190000016915868)
- [一次nodejs开发CLI的过程](https://juejin.im/post/5a90dd62f265da4e9a4973aa)
- [create-react-app源码分析](https://github.com/fi3ework/blog/issues/38)
- [vue-cli源码分析](https://kuangpf.com/vue-cli-analysis/serve/)
- [源码](git@github.com:brucelc/bru-cli.git)





