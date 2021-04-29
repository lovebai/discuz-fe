import React, { Component } from 'react';
import styles from './index.module.scss';
import { Dialog, Button, Checkbox } from '@discuzq/design';
import CommonAccountContent from '../../components/common-account-content';
import { inject } from 'mobx-react';

@inject('payBox')
export default class index extends Component {

  onClose = () => {
    // FIXME: 延时回调的修复
    this.props.payBox.visible = false
    setTimeout(() => {
      this.props.payBox.clear();
    },1000)
  }

  goToThePayConfirmPage = async () => {
    try {
      await this.props.payBox.createOrder();
    } catch (error) {
      console.error(error);
    }
  };

  render() {
    const { options = {} } = this.props.payBox;
    const { amount } = options;
    return (
      <div>
        <>
          <div className={styles.amountWrapper}>
            <CommonAccountContent currentPaymentData={options} />
            {/* 按钮区域-提交内容 */}
            <div className={styles.amountAddUp}>合计：<span className={styles.amountMoney}>￥ {amount} 元</span></div>
            <div className={styles.amountSubmit}>
              <Button type="primary" onClick={this.goToThePayConfirmPage} size="large" className={styles.asBtn} full>
                确认支付
              </Button>
            </div>
            {/* 关闭按钮 */}
            <div
              onClick={this.onClose}
              className={styles.amountCloseBtn}
            >
              X
            </div>
          </div>
        </>
      </div>
    );
  }
}