import React, { Component } from 'react';
import styles from './index.module.scss';
import { Button } from '@discuzq/design';
import { inject, observer } from 'mobx-react';
@inject('site')
@inject('user')
@observer
export default class MemberShipCard extends Component {

  constructor(props) {
    super(props)
  }

  handleRenewalFee = () => {
    this.props.handleRenewalFee && this.props.handleRenewalFee()
  }

  render() {
    const { shipCardClassName } = this.props
    return (
      <div className={`${styles.memberShipCardWrapper} ${shipCardClassName}`}>
        <div className={styles.MemberShipCardContent}>
          <div className={styles.roleType}>普通会员</div>
          <div className={styles.tagline}>访问海量站点内容•发布内容</div>
          <div className={styles.RenewalFee}>
            <Button onClick={this.handleRenewalFee} type="primary" className={styles.btn}>续费</Button>
            <span className={styles.feeTimer}>
              <span className={styles.feeDay}>5</span>天•8月15日到期
            </span>
          </div>
        </div>
      </div>
    );
  }
}
