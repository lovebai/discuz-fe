import { IPluginContext } from '@tarojs/service'

const fs = require('fs-extra')
const path = require('path');

const pluginPagePath = path.resolve(__dirname, './pluginPages')

const createPluginFiles = () => {
    fs.ensureDirSync(pluginPagePath);

    fs.ensureFileSync(path.resolve(pluginPagePath, './123/index.jsx'))

    fs.ensureFileSync(path.resolve(pluginPagePath, './123/123/index.jsx'))

    fs.ensureFileSync(path.resolve(pluginPagePath, './123/index.config.js'))

    fs.ensureFileSync(path.resolve(pluginPagePath, './123/123/index.config.js'))
}

// // 删除 plugin 临时目录
const removePluginFiles = () => {
    fs.removeSync(pluginPagePath);
}

const pagePluginWrapperTemplate = `
/* eslint-disable spaced-comment */
/* eslint-disable new-cap */
import React from 'react';
import Page from '@components/page';
import { inject, observer } from 'mobx-react';
import { View } from '@tarojs/components';

// 插件插槽埋入
/**DZQ->plugin->register<plugin_page@page_extension_entry_hook>**/

@inject('site')
class PagePlugin extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      pluginPath: '',
    };
  }

  getTargetPlugin = () => {
    const { site } = this.props;
    return DZQPluginCenter.injection('plugin_page', 'page_extension_entry_hook').map(({ render, pluginInfo }) => {
      if (pluginInfo.registerPath === this.state.pluginPath) {
        return (
          <div key={pluginInfo.name}>
            {render({
              renderData: {},
              site,
              pluginInfo,
            })}
          </div>
        );
      }
      return null;
    });
  }

  renderTargetPlugin = () => {
    const targetPlugins = this.getTargetPlugin();
    return targetPlugins;
  }

  render() {
    return <Page>{this.renderTargetPlugin()}</Page>
  }
}

export default PagePlugin;
`;

const pagePluginConfigTemplate = `
export default {
    navigationBarTitleText: '站点信息',
    navigationStyle: 'custom',
    enableShareAppMessage: true,
};`;

const generatePagePluginConfig = () => {
    fs.writeFileSync(path.resolve(pluginPagePath, './123/index.jsx'), `
    /* eslint-disable spaced-comment */
/* eslint-disable new-cap */
import React from 'react';
import Page from '@components/page';
import { View } from '@tarojs/components';
import { inject, observer } from 'mobx-react';

// 插件插槽埋入
/**DZQ->plugin->register<plugin_page@page_extension_entry_hook>**/

@inject('site')
class PagePlugin extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      pluginPath: '/123',
    };
  }

  getTargetPlugin = () => {
    const { site } = this.props;
    return DZQPluginCenter.injection('plugin_page', 'page_extension_entry_hook').map(({ render, pluginInfo }) => {
      if (pluginInfo.registerPath === this.state.pluginPath) {
        return (
          <View key={pluginInfo.name}>
            {render({
              renderData: {},
              site,
              pluginInfo,
            })}
          </View>
        );
      }
      return null;
    });
  }

  renderTargetPlugin = () => {
    const targetPlugins = this.getTargetPlugin();
    return targetPlugins;
  }

  render() {
    return <Page>{this.renderTargetPlugin()}</Page>
  }
}

export default PagePlugin;`);

    fs.writeFileSync(path.resolve(pluginPagePath, './123/123/index.jsx'), `
    /* eslint-disable spaced-comment */
/* eslint-disable new-cap */
import React from 'react';
import Page from '@components/page';
import { inject, observer } from 'mobx-react';

// 插件插槽埋入
/**DZQ->plugin->register<plugin_page@page_extension_entry_hook>**/

@inject('site')
class PagePlugin extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      pluginPath: '/123/123',
    };
  }

  getTargetPlugin = () => {
    const { site } = this.props;
    return DZQPluginCenter.injection('plugin_page', 'page_extension_entry_hook').map(({ render, pluginInfo }) => {
      if (pluginInfo.registerPath === this.state.pluginPath) {
        return (
          <View key={pluginInfo.name}>
            {render({
              renderData: {},
              site,
              pluginInfo,
            })}
          </View>
        );
      }
      return null;
    });
  }

  renderTargetPlugin = () => {
    const targetPlugins = this.getTargetPlugin();
    return targetPlugins;
  }

  render() {
    return <Page>{this.renderTargetPlugin()}</Page>
  }
}

export default PagePlugin;`);

    fs.writeFileSync(path.resolve(pluginPagePath, './123/index.config.js'), `export default {
        navigationBarTitleText: '插件页面',
    };`);

    fs.writeFileSync(path.resolve(pluginPagePath, './123/123/index.config.js'), `export default {
        navigationBarTitleText: '插件页面',
    };`)
}


export default (ctx: IPluginContext, options) => {

  console.log(ctx);

    // plugin 主体
    
      console.log('编译开始！')
      console.log('正在清除旧的插件临时文件');
      removePluginFiles();
    
      console.log('正在创建新的插件临时文件');
      createPluginFiles();
    
      generatePagePluginConfig();

}
