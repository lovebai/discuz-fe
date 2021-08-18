import React, { Component } from 'react';
import styles from './index.module.scss';
import { Button, Icon } from '@discuzq/design';
import Header from '@components/header';
export default class RenewalFee extends Component {
  render() {
    return (
      <div className={styles.renewalFeeWrapper}>
        <Header />
        <div className={styles.renewalFeeContent}>
          <div className={styles.siteBg}></div>
          <div className={styles.menuInfo}>
            <div className={styles.menuItem}>
              <div className={styles.menuTitle}>站点名称</div>
              <div className={styles.menuValue}>Discuz！Q</div>
            </div>
            <div className={styles.menuItem}>
              <div className={styles.menuTitle}>站长</div>
              <div className={styles.menuValue}>Discuz！Q</div>
            </div>
            <div className={styles.menuItem}>
              <div className={styles.menuTitle}>更新</div>
              <div className={styles.menuValue}>Discuz！Q</div>
            </div>
            <div className={styles.menuItem}>
              <div className={styles.menuTitle}>成员</div>
              <div className={styles.menuValue}>Discuz！Q</div>
            </div>
            <div className={styles.menuItem}>
              <div className={styles.menuTitle}>主题</div>
              <div className={styles.menuValue}>Discuz！Q</div>
            </div>
            <div className={styles.menuItem}>
              <div className={styles.menuTitle}>站点名称</div>
              <div className={styles.menuValue}>Discuz！Q</div>
            </div>
            <div className={styles.menuItem}>
              <div className={styles.menuTitle}>站点名称</div>
              <div className={styles.menuValue}>Discuz！Q</div>
            </div>
            <div className={styles.menuItem}>
              <div className={styles.menuTitle}>站点名称</div>
              <div className={styles.menuValue}>Discuz！Q</div>
            </div>
            <div className={styles.menuItem}>
              <div className={styles.menuTitle}>站点名称</div>
              <div className={styles.menuValue}>Discuz！Q</div>
            </div>
            <div className={styles.menuItem}>
              <div className={styles.menuTitle}>站点名称</div>
              <div className={styles.menuValue}>Discuz！Q</div>
            </div>
            <div className={styles.menuItem}>
              <div className={styles.menuTitle}>站点名称</div>
              <div className={styles.menuValue}>Discuz！Q</div>
            </div>
            <div className={styles.menuItem}>
              <div className={styles.menuTitle}>站点名称</div>
              <div className={styles.menuValue}>Discuz！Q</div>
            </div>
            <div className={styles.menuItem}>
              <div className={styles.menuTitle}>站点名称</div>
              <div className={styles.menuValue}>Discuz！Q</div>
            </div>
            <div className={styles.menuItem}>
              <div className={styles.menuTitle}>站点名称</div>
              <div className={styles.menuValue}>Discuz！Q</div>
            </div>
            <div className={styles.menuItem}>
              <div className={styles.menuTitle}>站点名称</div>
              <div className={styles.menuValue}>Discuz！Q</div>
            </div>
            <div className={styles.menuItem}>
              <div className={styles.menuTitle}>站点名称</div>
              <div className={styles.menuValue}>Discuz！Q</div>
            </div>
            <div className={styles.menuItem}>
              <div className={styles.menuTitle}>有效期</div>
              <div className={styles.menuValue}>6天</div>
            </div>
          </div>
          <div className={styles.feeBtn}>
            <Button type="primary" className={styles.btn}>
              ￥1 立即续费
            </Button>
          </div>
        </div>
      </div>
    );
  }
}
