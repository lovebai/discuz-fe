import React, { Component } from 'react';
import Taro from '@tarojs/taro';
import { View, Text } from '@tarojs/components';
import styles from './index.module.scss';
import Button from '@discuzq/design/dist/components/button/index';
import { inject, observer } from 'mobx-react';

@inject('site')
@inject('user')
@observer
export default class MemberShipCard extends Component {

  constructor(props) {
    super(props)
  }

  handleRenewalFee = () => {
    this.props.onRenewalFeeClick && this.props.onRenewalFeeClick()
  }

  render() {
    const { shipCardClassName } = this.props
    return (
      <View className={`${styles.memberShipCardWrapper} ${shipCardClassName}`}>
        <View className={styles.MemberShipCardContent}>
          <View className={styles.roleType}>普通会员</View>
          <View className={styles.tagline}>访问海量站点内容•发布内容</View>
          <View className={styles.RenewalFee}>
            <Button onClick={this.handleRenewalFee} type="primary" className={styles.btn}>续费</Button>
            <Text className={styles.feeTimer}>
              <Text className={styles.feeDay}>5</Text>天•8月15日到期
            </Text>
          </View>
        </View>
      </View>
    );
  }
}
