
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

      console.log(pluginInfo)
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

export default PagePlugin;