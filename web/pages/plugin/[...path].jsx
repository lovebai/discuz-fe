/* eslint-disable spaced-comment */
/* eslint-disable new-cap */
import React from 'react';
import { inject, observer } from 'mobx-react';
import { withRouter } from 'next/router';
import HOCFetchSiteData from '@middleware/HOCFetchSiteData';

// 插件插槽埋入
/**DZQ->plugin->register<plugin_page@page_extension_entry_hook>**/

@inject('site')
class PagePlugin extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      pluginPath: `/${this.props.router.query.path.join('/')}`,
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
    return this.renderTargetPlugin();
  }
}

export default withRouter(HOCFetchSiteData(PagePlugin));
