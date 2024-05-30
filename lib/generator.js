const {
    getRepoList,
    getTagList
} = require('./http')
const ora = require('ora')
const inquirer = require('inquirer')
const util = require('util')
const path = require('path')
const downloadGitRepo = require('download-git-repo')
const chalk = require('chalk')
async function wrapLoading(fn, message, ...args) {
    const spinner = ora(message);
    spinner.start();
    try {
        const result = await fn(...args);
        spinner.succeed('请求成功!');
        return result;
    } catch (error) {
        spinner.fail('请求失败...', error)
        return ''
    }
}
class Generator {
    constructor(name, targetDir) {
        this.name = name;
        this.targetDir = targetDir;
        this.downloadGitRepo = util.promisify(downloadGitRepo);
    }
    async getRepo() {
        let {vueOrReact} = await inquirer.prompt([
            {
                name: 'vueOrReact',
                type: 'list',
                choices: ['vue项目','react项目'],
                message: '请选择需要创建的项目类型'
            }
        ])
        vueOrReact = vueOrReact === 'vue项目' ? true : false;
        const repoList = await wrapLoading(getRepoList, '模板获取中...',vueOrReact);
        if (!repoList.data.length) return;
        const repos = repoList.data.map(item => item.name);
        const {repo}= await inquirer.prompt([{
            name: 'repo',
            type: 'list',
            choices: repos,
            message: '选择一个需要创建的模板'
        }])
        return {
            repo:repo,
            isVue:repoList.isVue
        };
    }
    async getTag(repo,isVue) {
        const tags = await wrapLoading(getTagList, '获取版本信息...', {repo,isVue});
        if (!tags.length) return;
        const tagsList = tags.map(item => item.name);
        const {
            tag
        } = await inquirer.prompt([{
            name: 'tag',
            type: 'list',
            choices: tagsList,
            message: `请选择${repo}项目的版本号`
        }])
        console.log(chalk.green.underline(`创建的版本是${tag}`));
        return tag
    }
    async download(repo, tag,isVue) {
        let requestUrl = '';
        if(isVue){
            requestUrl = `vuejs/${repo}${tag?'#'+tag:''}`;
        }else{
            requestUrl = `reactjs/${repo}${tag?'#'+tag:''}`;
        }
        let status = ''
        try {
            await wrapLoading(
                this.downloadGitRepo,
                '模板下载执行中...',
                requestUrl,
                path.resolve(process.cwd(), this.targetDir))
            status = 'success'
        } catch (error) {
            status = 'error'
        } finally{
            return status;
        }
    }
    async create() {
        const {repo,isVue} = await this.getRepo();
        const tag = await this.getTag(repo,isVue);
        console.log('create函数中得到的tag',tag);
        const status =  await this.download(repo, tag,isVue);
        if(status === 'success'){
             console.log(chalk.green.underline(`\r\n创建成功！ ${chalk.cyan('cd ./'+this.name)}`))
        }else {
             console.log(chalk.red.underline(`创建失败！${chalk.cyan(this.name)}`));
        }
    }
}
module.exports = Generator;