import React, { Component } from 'react';
import Taro from '@tarojs/taro';
import { View, Text } from '@tarojs/components';
import { Input, Button, Icon } from '@discuzq/design';
import { observer, inject } from 'mobx-react';
import classNames from 'classnames';
import styles from './index.module.scss';

import DateTimePicker from '../date-time-picker';

@inject('threadPost')
@observer
class RewardQa extends Component {
  constructor() {
    super();
    this.state = {
      money: '', // 悬赏金额
      selectedTime: '', // 悬赏时间
      initValue: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000), // 时间选择框初始值
    };
    this.timeRef = React.createRef();
  }

  componentDidMount() { // 回显悬赏信息
    const { rewardQa: { price, expiredAt } } = this.props.threadPost.postData;
    price && expiredAt && this.setState({
      money: price,
      selectedTime: expiredAt,
    })
  }

  onMoneyChang = (e) => { // 处理悬赏金额输入
    const val = e.target.value;
    const money = val.replace(/\.\d*$/, $1 => {
      return $1.slice(0, 3)
    })
    this.setState({ money })
  }

  openTimePicker = () => { // 开启时间选择框
    const { openModal } = this.timeRef.current;
    openModal();
  }

  onConfirm = (val) => { // 监听时间选中
    this.setState({
      selectedTime: val
    });
  };

  handleCancel = () => { // 取消悬赏
    Taro.navigateBack();
  }

  handleConfirm = () => { // 确认悬赏
    if (this.checkMoney() && this.checkTime()) {
      // 更新store
      const { money, selectedTime } = this.state;
      const { setPostData } = this.props.threadPost;
      setPostData({
        rewardQa: {
          price: parseFloat(money),
          expiredAt: selectedTime,
        }
      })
      // 返回上一页
      Taro.navigateBack();
    }

  }

  checkMoney = () => {
    const { money } = this.state;
    if (!money) {
      Taro.showToast({
        title: '请选择悬赏金额',
        icon: 'none',
        duration: 2000
      })
      return false;
    }
    if (money < 0.1 || money > 1000000) {
      Taro.showToast({
        title: '可选悬赏金额为0.1 ~ 1000000元',
        icon: 'none',
        duration: 2000
      })
      return false;
    }
    return true;
  }

  checkTime = () => {
    const { selectedTime } = this.state;
    if (!selectedTime) {
      Taro.showToast({
        title: '请选择悬赏时间',
        icon: 'none',
        duration: 2000
      })
      return false;
    }
    const selectTime = (new Date(selectedTime)).getTime();
    const diffTime = selectTime - Date.now();
    if (diffTime < 86400000) {
      Taro.showToast({
        title: '悬赏时间需要大于一天',
        icon: 'none',
        duration: 2000
      })
      return false;
    }
    return true;
  }

  render() {
    const { money, selectedTime } = this.state;

    return (
      <View className={styles.wrapper}>
        {/* 悬赏金额 */}
        <View className={styles['reward-item']}>
          <Text className={styles['reward-text']}>悬赏金额</Text>
          <View className={styles['reward-money']}>
            <Input
              value={money}
              mode="number"
              miniType="number"
              placeholder="金额"
              placeholderStyle="color:#c5c6ca"
              maxLength={10}
              onChange={this.onMoneyChang}
            />元
          </View>
        </View>
        {/* 悬赏结束时间 */}
        <View className={styles['reward-item']}>
          <Text className={styles['reward-text']}>悬赏结束时间</Text>
          <View className={styles['reward-time']}>
            <View
              className={classNames(
                styles['selected-time'],
                !selectedTime && styles['default-time']
              )}
              onClick={this.openTimePicker}
            >
              {selectedTime || '请选择悬赏时间'}
            </View>
            <Icon name="RightOutlined" size={10} />
          </View>
        </View>
        {/* 按钮 */}
        <View className={styles.btn}>
          <Button onClick={this.handleCancel}>取消</Button>
          <Button className={styles['btn-confirm']} onClick={this.handleConfirm}>确定</Button>
        </View>
        {/* 时间选择弹框 */}
        <DateTimePicker
          ref={this.timeRef}
          onConfirm={this.onConfirm}
          initValue={this.state.initValue}
          wrap-class="my-class"
          select-item-class="mySelector"
        />

      </View>
    );
  }
}

export default RewardQa;
