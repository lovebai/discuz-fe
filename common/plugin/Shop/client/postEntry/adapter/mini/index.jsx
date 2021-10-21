import React from 'react';
import Taro from '@tarojs/taro';
import { Icon, Dialog, Toast } from '@discuzq/design';

export default class ShopPostEntry extends React.Component {
  constructor(props) {
    super(props);
  }

  handleIconClick = () => {
    Taro.navigateTo({ url: '/pluginPages/selectProduct/index' });
  };

  isShowApplyIcon = () => {
    const { siteData, _pluginInfo } = this.props;
    const { pluginConfig } = siteData;
    if (!pluginConfig) return false;
    const [act] = (pluginConfig || []).filter(item => item.app_id === _pluginInfo.options.tomId);
    if (act?.authority?.canUsePlugin) return true;
    return false;
  };

  render() {
    if (!this.isShowApplyIcon()) return null;
    return (
      <>
        <Icon
          onClick={this.handleIconClick}
          name="ShoppingCartOutlined"
          size="20"
        />
      </>
    );
  }
}
