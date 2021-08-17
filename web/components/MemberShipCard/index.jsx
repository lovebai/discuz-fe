import React, { Component } from 'react';
import styles from './index.module.scss';
import { Button } from '@discuzq/design';

export default class MemberShipCard extends Component {
  render() {
    return (
      <div className={styles.memberShipCardWrapper}>
        <div className={styles.MemberShipCardContent}>
          <div className={styles.roleType}>普通会员</div>
          <div className={styles.tagline}>访问海量站点内容•发布内容</div>
          <div className={styles.RenewalFee}>
            <Button type="primary" className={styles.btn}>续费</Button>
            <span className={styles.feeTimer}>
              <span className={styles.feeDay}>5</span>天•8月15日到期
            </span>
          </div>
        </div>
      </div>
    );
  }
}
