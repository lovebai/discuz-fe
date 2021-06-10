import React from 'react';
import { observer } from 'mobx-react';
import { View, Text } from '@tarojs/components';
import { diffDate } from '@common/utils/diff-date';
import { time } from '@discuzq/sdk/dist/index';
import styles from './index.module.scss';


const STATUS_MAP = {
  1: '待审核',
  2: '审核通过',
  3: '审核不通过',
  4: '待打款',
  5: '已打款',
  6: '打款失败',
};

@observer
class IncomeList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const { itemKey, dataLength } = this.props;
    const { cashApplyAmount, tradeTime, cashStatus, tradeNo } = this.props.withdrawalVal;
    return (
      <View className={styles.container}>
        <View className={styles.content}>
          <View className={styles.text}>提现</View>
          <View className={styles.money}>{cashApplyAmount}</View>
        </View>
        <View className={styles.footer}>
          <View className={styles.time}>{tradeTime ? time.formatDate(tradeTime,  'YYYY-MM-DD HH:mm') : ''}</View>
          <View className={styles[`withdrawalStatus${cashStatus}`]}>{STATUS_MAP[cashStatus]}</View>
        </View>
        {/* // FIXME:这里的结构有问题 怪怪的 所以只能用数组长度取消底部边框线 */}
        <View className={styles.serialNumber} style={{ borderBottom: itemKey === dataLength - 1 && 0 }}>
          <Text>流水号:</Text>
          <Text>{tradeNo || '暂无'}</Text>
        </View>
      </View>
    );
  }
}

export default IncomeList;
