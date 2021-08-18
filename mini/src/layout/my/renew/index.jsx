import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import styles from './index.module.scss';
import Button from '@discuzq/design/dist/components/button/index';
import { View, Text } from '@tarojs/components';
import { numberFormat } from '@common/utils/number-format';
import time from '@discuzq/sdk/dist/time';

@inject('site')
@inject('user')
@observer
class RenewalFee extends Component {
  render() {
    const siteBackgroundImage = this.props.site?.siteBackgroundImage;
    return (
      <View className={styles.renewalFeeWrapper}>
        <View className={styles.renewalFeeContent}>
          <View
            className={styles.siteBg}
            style={{
              backgroundImage: `url(${siteBackgroundImage})`,
            }}
          ></View>
          <View className={styles.menuInfo}>
            <View className={styles.menuItem}>
              <View className={styles.menuTitle}>站点名称</View>
              <View className={styles.menuValue}>{this.props.site?.siteName}</View>
            </View>
            <View className={styles.menuItem}>
              <View className={styles.menuTitle}>站长</View>
              <View className={styles.menuValue}>
                {this.props.site?.siteAuthor?.nickname || this.props.site?.siteAuthor.username}
              </View>
            </View>
            <View className={styles.menuItem}>
              <View className={styles.menuTitle}>更新</View>
              <View className={styles.menuValue}>刚刚</View>
            </View>
            <View className={styles.menuItem}>
              <View className={styles.menuTitle}>成员</View>
              <View className={styles.menuValue}>{numberFormat(this.props.site?.countUsers)}</View>
            </View>
            <View className={styles.menuItem}>
              <View className={styles.menuTitle}>主题</View>
              <View className={styles.menuValue}>{this.props.site?.countThreads}</View>
            </View>
            <View className={styles.menuItem}>
              <View className={styles.menuTitle}>有效期</View>
              <View className={styles.menuValue}>
                {this.props.user?.expiredDays === 0
                  ? `有效期：${0}天`
                  : `有效期：${this.props.user?.expiredDays}天•${time.formatDate(
                      this.props.user?.expiredAt,
                      'YYYY年MM月DD',
                    )}`}
              </View>
            </View>
          </View>
          <View className={styles.feeBtn}>
            <Button type="primary" className={styles.btn}>
              ￥{this.props.site?.sitePrice} 立即续费
            </Button>
          </View>
        </View>
      </View>
    );
  }
}

export default RenewalFee;
