import React from 'react';
import { Icon, Dialog, Button, Input, Textarea, Radio, Toast, Tabs } from '@discuzq/design';
import { goodImages } from '@common/constants/const';
import { readProcutAnalysis } from '@common/server';
import styles from '../index.module.scss';

export default class CustomApplyEntry extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      visible: false,
      activeTab: 'miniShop',
      link: '',
    };
  }

  handleDialogOpen = () => {
    this.setState({ visible: true });
  };

  handleDialogClose = () => {
    this.setState({ visible: false });
  };

  handleDialogConfirm = async () => {
    let product;
    if (this.state.activeTab === 'platformShop') {
      product = await this.fetchProductAnalysis({ address: this.state.link });
    }

    this.props.onConfirm({
      postData: {
        tomId: '61540fef8f4de8',
        body: {
          product,
        },
      },
    });

    console.log(this.props.renderData);

    this.handleDialogClose();
  };

  /**
   * 插件入口是否显示判断
   */
  isShowShopIcon = () => {
    const { siteData, _pluginInfo } = this.props;
    const { pluginConfig } = siteData;
    console.log(pluginConfig);
    if (!pluginConfig) return false;
    const [act] = (pluginConfig || []).filter(item => item.app_id === _pluginInfo.options.tomId);
    if (act?.authority?.canUsePlugin) return true;
    return false;
  };

  /**
   * 获取商品信息
   * @param {*} options
   */
  fetchProductAnalysis = async (options = {}) => {
    const ret = await readProcutAnalysis({ data: options });
    const { code, data = {}, msg } = ret;
    if (code === 0) {
      console.log('分析成功, data -> ', data);
      return data;
    }
    Toast.error({ content: msg });
  }

  // TODO: 完善商品 tab 状态判断函数
  /**
   * 是否展示小商店商品 tab 判断
   */
  isShowMiniShopTab = () => true;

  /**
   * 渲染小商店 tab
   */
  renderMiniShopTab = () => {
    console.log('mini shop');
    if (!this.isShowMiniShopTab()) return null;
    return (
      <Tabs.TabPanel key={'miniShop'} id={'miniShop'} label={'添加微信小店商品'}>
        <div>
          1
        </div>
      </Tabs.TabPanel>
    );
  };

  /**
   * 渲染平台商品 tab
   */
  renderPlatformShopTab = () => {
    const { link } = this.state;
    return (
      <Tabs.TabPanel key={'platformShop'} id={'platformShop'} label={'添加平台商品链接'}>
        <div className={styles.platformShopBox}>
          <div className={styles['parse-goods-box']}>
            <div className={styles.wrapper}>
              <div className={styles['parse-goods-title']}>现支持以下商品链接</div>
              <div className={styles['parse-goods-image']}>
                {goodImages.map(item => (
                  <div className={styles['image-item']} key={item.name}>
                    <img src={item.src} alt={item.name} width={item.width} height={item.height} />
                    <span className={styles['image-text']}>{item.name}</span>
                  </div>
                ))}
              </div>
              <Input.Textarea
                value={link}
                placeholder="请粘贴\输入商品的分享链接"
                maxLength={49999}
                rows={8}
                onChange={(e) => {
                  this.setState({
                    link: e.target.value,
                  });
                }}
              />
            </div>
          </div>
        </div>
      </Tabs.TabPanel>
    );
  };

  render() {
    const { siteData } = this.props;
    const platform = siteData.platform === 'h5' ? styles.h5 : styles.pc;
    const isPc = siteData.platform !== 'h5';

    const { visible } = this.state;

    if (!this.isShowShopIcon()) return null;

    return (
      <>
        <Icon onClick={this.handleDialogOpen} name="ShoppingCartOutlined" size="20" />
        <Dialog
          visible={visible}
          onCancel={this.handleDialogClose}
          onClose={this.handleDialogClose}
          onConfirm={this.handleDialogConfirm}
          isNew={true}
          type="confirm"
          title="添加商品"
          bodyClassName={styles.shopDialogBody}
          className={styles.shopDialog}
        >
          <Tabs
            scrollable={true}
            type={'primary'}
            activeId={this.state.activeTab}
            onActive={(activeId) => {
              this.setState({
                activeTab: activeId,
              });
            }}
          >
            {this.renderMiniShopTab()}
            {this.renderPlatformShopTab()}
          </Tabs>
        </Dialog>
      </>
    );
  }
}
