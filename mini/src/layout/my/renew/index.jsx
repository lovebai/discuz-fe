import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import styles from './index.module.scss';
import Button from '@discuzq/design/dist/components/button/index';
import { View, Text } from '@tarojs/components';

@inject('site')
@observer
class RenewalFee extends Component {
  render() {
    const siteBackgroundImage = this.props.site?.siteBackgroundImage
    return (
      <View className={styles.renewalFeeWrapper}>
        <View className={styles.renewalFeeContent}>
          <View className={styles.siteBg} style={{
            backgroundImage: `url(${siteBackgroundImage})`
          }}>
          </View>
          <View className={styles.menuInfo}>
            <View className={styles.menuItem}>
              <View className={styles.menuTitle}>站点名称</View>
              <View className={styles.menuValue}>Discuz！Q</View>
            </View>
            <View className={styles.menuItem}>
              <View className={styles.menuTitle}>站长</View>
              <View className={styles.menuValue}>Discuz！Q</View>
            </View>
            <View className={styles.menuItem}>
              <View className={styles.menuTitle}>更新</View>
              <View className={styles.menuValue}>Discuz！Q</View>
            </View>
            <View className={styles.menuItem}>
              <View className={styles.menuTitle}>成员</View>
              <View className={styles.menuValue}>Discuz！Q</View>
            </View>
            <View className={styles.menuItem}>
              <View className={styles.menuTitle}>主题</View>
              <View className={styles.menuValue}>Discuz！Q</View>
            </View>
            <View className={styles.menuItem}>
              <View className={styles.menuTitle}>站点名称</View>
              <View className={styles.menuValue}>Discuz！Q</View>
            </View>
            <View className={styles.menuItem}>
              <View className={styles.menuTitle}>站点名称</View>
              <View className={styles.menuValue}>Discuz！Q</View>
            </View>
            <View className={styles.menuItem}>
              <View className={styles.menuTitle}>站点名称</View>
              <View className={styles.menuValue}>Discuz！Q</View>
            </View>
            <View className={styles.menuItem}>
              <View className={styles.menuTitle}>站点名称</View>
              <View className={styles.menuValue}>Discuz！Q</View>
            </View>
            <View className={styles.menuItem}>
              <View className={styles.menuTitle}>站点名称</View>
              <View className={styles.menuValue}>Discuz！Q</View>
            </View>
            <View className={styles.menuItem}>
              <View className={styles.menuTitle}>站点名称</View>
              <View className={styles.menuValue}>Discuz！Q</View>
            </View>
            <View className={styles.menuItem}>
              <View className={styles.menuTitle}>站点名称</View>
              <View className={styles.menuValue}>Discuz！Q</View>
            </View>
            <View className={styles.menuItem}>
              <View className={styles.menuTitle}>站点名称</View>
              <View className={styles.menuValue}>Discuz！Q</View>
            </View>
            <View className={styles.menuItem}>
              <View className={styles.menuTitle}>站点名称</View>
              <View className={styles.menuValue}>Discuz！Q</View>
            </View>
            <View className={styles.menuItem}>
              <View className={styles.menuTitle}>站点名称</View>
              <View className={styles.menuValue}>Discuz！Q</View>
            </View>
            <View className={styles.menuItem}>
              <View className={styles.menuTitle}>站点名称</View>
              <View className={styles.menuValue}>Discuz！Q</View>
            </View>
            <View className={styles.menuItem}>
              <View className={styles.menuTitle}>有效期</View>
              <View className={styles.menuValue}>6天</View>
            </View>
          </View>
          <View className={styles.feeBtn}>
            <Button type="primary" className={styles.btn}>
              ￥1 立即续费
            </Button>
          </View>
        </View>
      </View>
    );
  }
}

export default RenewalFee;
