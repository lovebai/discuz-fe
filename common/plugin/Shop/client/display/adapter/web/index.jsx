import React from 'react';
import { Icon } from '@discuzq/design';
import { MINI_SHOP_TYPE, PLATFORM_SHOP_TYPE } from '@common/plugin/Shop/client/common';
import classNames from 'classnames';
import styles from '../index.module.scss';

export default class ShopDisplay extends React.Component {
  handleBuy = (url) => {
    url && window.open(url);
  };

  render() {
    const { renderData } = this.props;
    if (!renderData) return null;
    const { body } = renderData || {};
    const { products } = body || {};
    return (products || []).map((item) => {
      const { data, type } = item;
      return (
        <div className={styles.wrapper} key={data?.id}>
          <div className={styles['wrapper-left']}>
            <img
              className={styles['wrapper-left_left']}
              src={data?.imagePath}
              title={data?.title}
              alt={data?.title}
            />
            <div className={styles['wrapper-left_right']}>
              <div className={styles['wrapper-left_right_title']}>
                {data?.title}
              </div>
              <div className={styles['wrapper-left_right_price']}>
                {data?.price}
              </div>
            </div>
          </div>
          {type === MINI_SHOP_TYPE && (
            <div className={styles['wrapper-right']}>
              <img
                className={styles['wrapper-right_header']}
                src={data?.detailQrcode}
                title={data?.title}
                alt={data?.alt}
              />
              <div className={styles['wrapper-right_footer']}>
                扫描二维码查看详情
              </div>
            </div>
          )}
          {type === PLATFORM_SHOP_TYPE && (
            <div
              className={classNames(styles['wrapper-right'], styles['wrapper-platform'])}
              onClick={() => this.handleBuy(data?.detailContent)}
            >
              <Icon size="20" name="ShoppingCartOutlined" />
              <div className={styles['wrapper-right_footer']}>
                购买商品
              </div>
            </div>
          )}
        </div>
      );
    });
  }
}
