const fs = require('fs-extra')
const glob = require('glob');
const path = require('path');

const createPluginFiles = () => {
    fs.ensureDirSync(__dirname, './pluginPages');
}

// // 删除 plugin 临时目录
const removePluginFiles = () => {
    fs.removeSync(__dirname, './pluginPages');
}

const pagePluginWrapperTemplate = ``;

const pagePluginConfigTemplate = `
export default {
    navigationBarTitleText: '站点信息',
    navigationStyle: 'custom',
    enableShareAppMessage: true,
};`;

const withPagePlugin = (config) => {
      // 默认插件位置
  const private_cwd = path.resolve(process.cwd(), '../common/plugin');
  const private_pluginFileList = glob.sync('**/config.json', {
    cwd: private_cwd
  });

  for ( let i = 0; i < private_pluginFileList.length; i++ ) {
    const filePath = path.resolve(private_cwd, private_pluginFileList[i]);
    const data = require(filePath);
    // 禁止状态忽略
    if ( data.disables ) {
      continue;
    }
    // const pluginConfig = require(path.resolve(private_cwd, private_pluginFileList[i]));
  }

  config.subPackages.push({
      root: 'pluginPages',
      pages: [
        '123/index',
        '123/123/index'
      ]
  })

  console.log('正在清除旧的插件临时文件');
  removePluginFiles();

  console.log('正在创建新的插件临时文件');
  createPluginFiles();
  return config;
}

module.exports = withPagePlugin;