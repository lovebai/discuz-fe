import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { Button, Icon, Spin } from '@discuzq/design';
import styles from './index.module.scss';
import CommonAccountContent from '../../components/common-account-content';
import { Toast } from '@discuzq/design';
import { STEP_MAP } from '../../../../../common/constants/payBoxStoreConstants';
import throttle from '@common/utils/thottle.js';
@inject('payBox')
@observer
export default class AmountRecognized extends Component {

  constructor(porps) {
    super(porps)
    this.state = {
      isLoading: false
    }
  }


  onClose = () => {
    setTimeout(() => {
      // FIXME: 延时回调的修复
      this.props.payBox.visible = false
      this.props.payBox.clear();
    }, 300)
  }

  // 点击支付去到 选择支付方式页面
  goToThePayConfirmPage = throttle(async () => {
    try {
      this.setState({
        isLoading: true,
      })
      const result = await this.props.payBox.createOrder();
      if (result.code === 0) {
        setTimeout(() => {
          this.setState({
            isLoading: false,
          })
        }, 1000)
      }
    } catch (error) {
      Toast.error({
        content: error.Message,
        hasMask: false,
        duration: 1000,
      });
      this.onClose()
      this.setState({
        isLoading: false,
      })
    }
  }, 300);

  // 转换金额小数
  transMoneyToFixed = (num) => {
    return Number(num).toFixed(2);
  };

  // 确认金额内容
  renderAmountRecognizedContent = () => {
    const { options = {} } = this.props.payBox;
    const { amount = 0 } = options;
    const { isLoading } = this.state
    return (
      <div className={styles.amountWrapper}>
        <div className={styles.giftInfo}>
          <CommonAccountContent currentPaymentData={options} />
        </div>
        {/* 按钮区域-提交内容 */}
        <div className={styles.btnBox}>
          <Button type="primary" onClick={this.goToThePayConfirmPage} size="large" className={styles.btn} full disabled={isLoading}>
            {isLoading ? <Spin type="spinner">支付中...</Spin> : `支付 ￥${this.transMoneyToFixed(amount)}`}
          </Button>
        </div>
        {/* 关闭按钮 */}
        <div className={styles.payBoxCloseIcon} onClick={this.onClose}>
          <Icon name="CloseOutlined" size={14} />
        </div>
      </div>
    );
  };

  render() {
    return <div>{this.renderAmountRecognizedContent()}</div>;
  }
}
