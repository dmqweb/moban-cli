const axios = require('axios');
const inquirer = require('inquirer')
axios.interceptors.response.use(res => {
    return res.data;
})
async function getRepoList(isVue) {
    if(isVue){
        return {
            data:await axios.get('https://api.github.com/orgs/vuejs/repos'),
            isVue:true
        };
    }else{
        return {
            data:await axios.get('https://api.github.com/orgs/reactjs/repos'),
            isVue:false
        }
    }
}
async function getTagList(repoObj) {
    const {repo,isVue} = repoObj;
    if(isVue){
        return await axios.get(`https://api.github.com/repos/vuejs/${repo}/tags`);
    }else{
        return await axios.get(`https://api.github.com/repos/reactjs/${repo}/tags`);
    }
}
module.exports = {
    getRepoList,
    getTagList
}