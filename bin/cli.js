#! /usr/bin/env node
const figlet = require('figlet');
const chalk = require('chalk');
const downLoad = require('download-git-repo');
const program = require('commander');
const  inquirer = require('inquirer');
program.description('模板创建工具').action(async()=>{
    const name = await inquirer.prompt([
        {
            type:'input',
            name:'name',
            message:'请输入项目名称',
            default:'test'
        }
    ])
    require('../lib/create.js')(name, {});
})
program
    .command('create [name]')
    .description('创建项目模板')
    .option('-f, --force', '强制覆盖已存在文件夹')
    .action((name='test', options) => {
        console.log(chalk.green.underline('默认项目名称:', name))
        require('../lib/create.js')(name, options);
    })
program
    .on('--help', () => {
        console.log('\r\n' + figlet.textSync('模板创建', {
            font: 'Ghost',
            horizontalLayout: 'default',
            verticalLayout: 'default',
            width: 80,
            whitespaceBreak: true
        }));
        console.log(`\r\nRun ${chalk.cyan(`moban create name`)} 创建一个项目模块\r\n`)
    })
program
    .version(`v${require('../package.json').version}`)
    .usage('moban create name')
program.parse(process.argv);