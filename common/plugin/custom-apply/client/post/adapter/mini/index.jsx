import React from 'react';
import { View, Text } from '@tarojs/components';
import { Icon } from '@discuzq/design';
import styles from '../index.module.scss';

export default class CustomApplyPost extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <View className={styles['dzqp-post-widget']}>
        <View className={styles['dzqp-post-widget__right']}>
          <Icon className={styles['dzqp-post-widget__icon']} name='ApplyOutlined' />
          <Text className={styles['dzqp-post-widget__text']}>活动报名</Text>
        </View>
        <Icon className={styles['dzqp-post-widget__left']} name='DeleteOutlined' />
      </View>
    );
  }
}
