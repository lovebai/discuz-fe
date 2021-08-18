import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import styles from './index.module.scss';
import { Dialog, Button, Icon } from '@discuzq/design';
import HOCFetchSiteData from '@middleware/HOCFetchSiteData';
@inject('site')
@observer
class RenewalFee extends Component {

  constructor(props) {
    super(props)
  }

  onClose = () => {
    this.props.onClose && this.props.onClose();
  };

  render() {
    return (
      <div className={styles.renewalFeeWrapper}>
        <Dialog visible={this.props.visible} position="center" maskClosable={true}>
          <div className={styles.renewalFeeContent}>
            {/* 关闭按钮 */}
            <div className={styles.renewalFeeClose} onClick={this.onClose}>
              <Icon name="CloseOutlined" size={12} color="#fff" />
            </div>
            <div className={styles.siteBg}>
              <img className={styles.siteBgImage} src={this.props.site?.siteBackgroundImage} />
            </div>
            <div className={styles.menuInfo}>
              <div className={styles.menuItem}>
                <div className={styles.menuTitle}>站点名称</div>
                <div className={styles.menuValue}>Discuz！Q</div>
              </div>
              <div className={styles.menuItem}>
                <div className={styles.menuTitle}>站长</div>
                <div className={styles.menuValue}>Discuz！Q</div>
              </div>
              <div className={styles.menuItem}>
                <div className={styles.menuTitle}>更新</div>
                <div className={styles.menuValue}>Discuz！Q</div>
              </div>
              <div className={styles.menuItem}>
                <div className={styles.menuTitle}>成员</div>
                <div className={styles.menuValue}>Discuz！Q</div>
              </div>
              <div className={styles.menuItem}>
                <div className={styles.menuTitle}>主题</div>
                <div className={styles.menuValue}>Discuz！Q</div>
              </div>
              <div className={styles.menuItem}>
                <div className={styles.menuTitle}>站点名称</div>
                <div className={styles.menuValue}>Discuz！Q</div>
              </div>
              <div className={styles.menuItem}>
                <div className={styles.menuTitle}>站点名称</div>
                <div className={styles.menuValue}>Discuz！Q</div>
              </div>
              <div className={styles.menuItem}>
                <div className={styles.menuTitle}>站点名称</div>
                <div className={styles.menuValue}>Discuz！Q</div>
              </div>
            </div>
            <div className={styles.feeBtn}>
              <Button type="primary" className={styles.btn}>
                ￥1 立即续费
              </Button>
              <div className={styles.effectTimer}>有效期：6天</div>
            </div>
          </div>
        </Dialog>
      </div>
    );
  }
}

export default HOCFetchSiteData(RenewalFee);
