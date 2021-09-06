import React from 'react';
import { View } from '@tarojs/components';
import styles from './index.module.scss';

export default ({type = 'error'}) => {
  return (
    <View className={styles.loadingBox}>
      <View style={{textAlign: 'center'}}>{ type === 'pay' ? '站点需要付费加入' : '数据异常'}</View>
      <View style={{textAlign: 'center'}}>进入小程序了解精彩内容</View>
    </View>
  )
}