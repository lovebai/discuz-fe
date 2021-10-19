/* eslint-disable spaced-comment */
/* eslint-disable new-cap */
import React from 'react';
import { inject, observer } from 'mobx-react';
import { withRouter } from 'next/router';
import HOCFetchSiteData from '@middleware/HOCFetchSiteData';

// 插件插槽埋入
/**DZQ->plugin->register<plugin_system@add_page_hook>**/

@inject('site')
@inject('user')
@observer
class PagePlugin extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      pluginPath: `/${this.props.router.query.path.join('/')}`,
    };
  }

  getTargetPlugin = () => {
    const { site, user } = this.props;
    return DZQPluginCenter.injection('plugin_system', 'add_page_hook').map(({ render, pluginInfo }) => {
      if (pluginInfo.path === this.state.pluginPath) {
        return (
          <div key={pluginInfo.name}>
            {render({
              site,
              userInfo: user.userInfo,
              isLogin: user.isLogin.bind(user),
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
