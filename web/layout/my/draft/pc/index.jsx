import React from 'react';
import { inject, observer } from 'mobx-react';
// import BaseLayout from '@components/base-layout';
import Tideway from '@components/pop-topic';
import ThreadCenterView from '@components/thread/ThreadCenterView';
import NoData from '@components/no-data';
import Copyright from '@components/copyright';
import UserCenterFansPc from '@components/user-center/fans-pc';
import styles from './index.module.scss';
import { Icon } from '@discuzq/design';
import { withRouter } from 'next/router';
import BaseLayout from '@components/user-center-base-laout-pc';

@inject('index')
@inject('user')
@observer
class PC extends React.Component {
  // 加载更多
  onPullingUp = () => this.props.dispatch(true);

  renderRight = () => (
    <div className={styles['right']}>
      <Tideway />
      <UserCenterFansPc userId={this.props.user.id} />
      <Copyright />
    </div>
  );

  renderHeader = () => (
    <div className={styles.header}>
      <div className={styles['header-left']}>
        <Icon name="RecycleBinOutlined" size={20} />
        草稿箱
      </div>
      <div className={styles['header-right']}>
        共有{ this.props.index.drafts?.totalCount || 0 }条草稿
      </div>
    </div>
  )

  renderContent = () => {
    const { index } = this.props;
    const list = (index.drafts && index.drafts.pageData) || [];
    return (
      <div className={styles.wrapper}>
        {this.renderHeader()}
        <div className={styles.content}>
          {list.length === 0 && <NoData />}
          {list.map((item, index) => (
            <div className={styles.item} key={index}>
              <div className={styles['item-left']}>
                <ThreadCenterView data={item} onClick={() => this.props.onEdit(item)}/>
                <div className={styles['item-time']}>编辑于&nbsp;{item.updatedAt}</div>
              </div>
              <div className={styles['item-right']}>
                <div className={styles['item-operate']} onClick={() => this.props.onEdit(item)}>
                  <Icon size={14} name="CompileOutlined" />编辑
                </div>
                <div className={styles['item-operate']} onClick={() => this.props.onDelete(item)}>
                  <Icon size={14} name="DeleteOutlined" />删除
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  render() {
    const { index } = this.props;
    const { currentPage, totalPage } = index.drafts || {};
    return (
      <BaseLayout
        onRefresh={this.onPullingUp}
        noMore={currentPage >= totalPage}
        showRefresh={false}
        right={this.renderRight()}
        contentHeader={() => true}
      >
        {this.renderContent()}
      </BaseLayout>
    );
  }
}

export default withRouter(PC);
