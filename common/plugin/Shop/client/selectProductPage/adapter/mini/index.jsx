import React from 'react';
import Taro, { eventCenter, getCurrentInstance } from '@tarojs/taro';
import { Icon, Button, Input, Tabs, Toast, Spin } from '@discuzq/design';
import { View, Image } from '@tarojs/components';
import { goodImages } from '@common/constants/const';
import styles from '../index.module.scss';

export default class SelectProduct extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      activeTab: 'miniShop', // 当前选中的 tab 类别
      link: '', // 平台商品的解析链接
      currentPage: 1, // 小商店的当前页数
      totalPage: 1, // 小商店的总页数
      totalCount: 0, // 小商店的商品总数
      miniShopProducts: {}, // 小商店的商品列表
      selectedMiniShopProducts: {}, // 选中的小商店商品
      loading: false, // 是否正在加载中
      fetchError: '', // 加载错误信息
      products: {},
    };
  }

  $instance = getCurrentInstance();

  componentWillMount() {
    const onReadyEventId = this.$instance.router.onReady;
    const onShowEventId = this.$instance.router.onShow;
    // 监听
    eventCenter.on(onShowEventId, this.onShow);
    eventCenter.once(onReadyEventId, this.onReady);
  }

  fetchMiniShopProductList = async (page) => {
    const { dzqRequest } = this.props;

    // 请求前 loading
    this.setState({
      loading: true,
    });

    try {
      const { code, data, msg } = await dzqRequest.request.http({
        url: '/plugin/shop/api/wxshop/list',
        method: 'GET',
        params: {
          page,
          perPage: '16',
        },
      });

      if (code !== 0) {
        Toast.error({
          content: msg,
        });
      }

      const { totalCount, totalPage, pageData, currentPage } = data;

      const { miniShopProducts } = this.state;

      const nextMiniShopProducts = Object.assign(
        {},
        {
          [currentPage]: pageData,
          ...miniShopProducts,
        },
      );
      this.setState({
        totalPage,
        totalCount,
        miniShopProducts: nextMiniShopProducts,
      });

      this.setState({
        loading: false,
      });

      return nextMiniShopProducts;
    } catch (error) {
      this.setState({
        loading: false,
      });

      this.props.dzqRequestHandleError(error);
    }
  };

  // on ready 生命周期
  onReady = () => {};

  // on show 生命周期
  onShow = () => {
    this.fetchMiniShopProductList();
  };

  // TODO: 完善商品 tab 状态判断函数
  /**
   * 是否展示小商店商品 tab 判断
   */
  isShowMiniShopTab = () => true;

  miniShopProductsAdapter = () => {
    let formatedMiniShopProducts = [];
    const { miniShopProducts } = this.state;

    for (const page in miniShopProducts) {
      formatedMiniShopProducts = [...formatedMiniShopProducts, ...miniShopProducts[page]];
    }

    return formatedMiniShopProducts;
  };

  /**
   * 渲染小商店 tab
   */
  renderMiniShopTab = () => {
    if (!this.isShowMiniShopTab()) return null;
    return (
      <Tabs.TabPanel key={'miniShop'} id={'miniShop'} label={'添加微信小店商品'}>
        <View className={styles.productItemWrapper} ref={this.miniShopListRef} onScroll={this.handleListScroll}>
          {this.miniShopProductsAdapter().map(productInfo => (
            <ShopProductItem
              isSelected={this.state.selectedMiniShopProducts[productInfo.productId]}
              onSelected={(checkedStatus) => {
                this.handleProductSelected(checkedStatus, productInfo);
              }}
              productInfo={productInfo}
            />
          ))}
          {this.state.loading && (
            <View className={styles.spinner}>
              <Spin type="spinner">加载中...</Spin>
            </View>
          )}
        </View>
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
        <View className={styles.platformShopBox}>
          <View className={styles['parse-goods-box']}>
            <View className={styles.wrapper}>
              <View className={styles['parse-goods-title']}>现支持以下商品链接</View>
              <View className={styles['parse-goods-image']}>
                {goodImages.map(item => (
                  <View className={styles['image-item']} key={item.name}>
                    <Image src={item.src} alt={item.name} width={item.width} height={item.height} />
                    <View className={styles['image-text']}>{item.name}</View>
                  </View>
                ))}
              </View>
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
            </View>
          </View>
        </View>
      </Tabs.TabPanel>
    );
  };

  render() {
    return (
      <View>
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
      </View>
    );
  }
}
