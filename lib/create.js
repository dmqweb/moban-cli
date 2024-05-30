const fs = require('fs-extra');
const path = require('path');
const chalk = require('chalk');
const ora = require('ora');
const inquirer = require('inquirer');
const Generator = require('./generator');
module.exports = async function (name, options) {
    const cwd = process.cwd();
    const targetAir = typeof name === 'object' ? path.join(cwd, name.name) :path.join(cwd,name);
    if (fs.existsSync(targetAir)) {
        if (options.force) {
            await fs.remove(targetAir);
        } else {
            const inquirerParams = [{
                name: 'action',
                type: 'list',
                message: '目标文件目录已经存在，请选择如下操作：',
                choices: [
                    { name: '替换当前目录', value: 'replace'},
                    { name: '移除已有目录', value: 'remove' }, 
                    { name: '取消当前操作', value: 'cancel' }
                ]
            }];
            let inquirerData = await inquirer.prompt(inquirerParams);
            if (!inquirerData.action) {
                return;
            } else if (inquirerData.action === 'remove') {
                const spinner = ora(`Loading ${chalk.red('删除中...')}`).start();
                try {
                    await fs.remove(targetAir);
                    spinner.succeed(chalk.green.underline(`\r\n删除成功！`));
                } catch (error) {
                    return spinner.error(chalk.red.underline('删除失败'))
                }
            }
        }
    }
    const generator = new Generator(name, targetAir);
    generator.create();
}