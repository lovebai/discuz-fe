import React from 'react';
import { inject, observer } from 'mobx-react';
import { Button, Icon, Avatar, Toast } from '@discuzq/design';
import { createRegister } from '@discuzq/sdk/dist/api/plugin/create-register';
import { deleteRegister } from '@discuzq/sdk/dist/api/plugin/delete-register';
import PopupList from '@components/thread/popup-list';
import classNames from 'classnames';
import styles from '../index.module.scss';

@inject('thread')
@inject('index')
class CustomApplyDisplay extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      popupShow: false,
      loading: false,
    };
  }

  getUserCls = (users = []) => {
    if (users.length >= 3) return styles.three;
    if (users.length === 2) return styles.two;
    if (users.length === 1) return styles.one;
  };

  getActStatusText = () => {
    const { body } = this.props.renderData || {};
    if (body?.isExpired) return '活动已过期';
    if (body?.isMemberFull) return '人数已满';
  };

  handleActOperate = async () => {
    const { renderData, thread, index } = this.props;
    const { tomId, body } = renderData || {};
    const { isRegistered, activityId, registerUsers } = body;
    const action = isRegistered ? deleteRegister : createRegister;
    this.setState({ loading: true });
    const res = await action({ data: { activityId } });
    this.setState({ loading: false });
    if (res.code === 0) {
      const { authorInfo } = thread;
      const users = registerUsers.filter(item => item.userId !== authorInfo.id);
      if (!isRegistered) users.push({
        userId: authorInfo.id,
        avatar: authorInfo.avatarUrl,
        nickname: authorInfo.nickname,
      });
      const tomValue = {
        body: {
          ...body,
          isRegistered: !isRegistered,
          registerUsers: users,
        },
        tomId,
      };
      thread.updateThread(tomId, tomValue);
      index.updateListThreadIndexes(thread?.threadData?.id, tomId, tomValue);
      Toast.info({ content: isRegistered ? '取消报名成功' : '报名成功' });
    } else Toast.error({ content: res.msg || '报名失败' });
    return res;
  };

  render() {
    const { siteData, renderData } = this.props;
    if (!renderData) return null;
    const { body } = renderData || {};
    const { isRegistered } = body;
    const isCanNotApply = body?.isExpired || body?.isMemberFull;
    const { popupShow } = this.state;
    const platform = siteData.platform === 'h5' ? styles.h5 : styles.pc;
    return (
      <>
        <div className={classNames(styles.wrapper, platform)}>
          <div className={styles['wrapper-header']}>
            <div className={styles['wrapper-header__left']}>
              {body?.title && body?.title}
            </div>
            <div className={styles['wrapper-header__right']}>
              还有<span className={styles['text-primary']}>14</span>分<span className={styles['text-primary']}>13</span>秒结束报名
            </div>
          </div>
          <div className={styles['wrapper-content']}>
            {body?.content && (
              <>
                <div className={
                  classNames(styles['wrapper-content__detail'], {
                    [styles['text-clamp']]: !siteData?.isDetailPage,
                  })
                }>
                  {body?.content}
                </div>
                {!siteData?.isDetailPage && (<div className={classNames(styles['text-primary'], styles.more)}>查看详情 ></div>)}
              </>
            )}
            <div className={classNames(styles['wrapper-content__tip'], styles.mt4n)}>
              <Icon name="TimeOutlined" />
              <div className={styles['wrapper-tip__content']}>
                <span className={styles['wrapper-tip_title']}>活动时间</span>
                <span className={styles['wrapper-tip_detail']}>2
                  {body?.activityStartTime}~{body?.activityEndTime}
                </span>
              </div>
            </div>
            <div className={styles['wrapper-content__tip']}>
              <Icon name="PositionOutlined" />
              <div className={styles['wrapper-tip__content']}>
                <span className={styles['wrapper-tip_title']}>活动地址</span>
                <span className={styles['wrapper-tip_detail']}>深圳市南山区人才公园</span>
              </div>
            </div>
            {body?.totalNumber && (
              <div className={styles['wrapper-content__limit']}>
                限<span className={styles['text-primary']}>{body?.totalNumber}</span>人参与
              </div>
            )}
          </div>
          <div className={styles['wrapper-footer']}>
            {!isCanNotApply && (
              <div className={styles['wrapper-footer__top']}>
                <div
                  className={classNames(styles.users, this.getUserCls(body?.registerUsers || []))}
                  onClick={() => this.setState({ popupShow: true })}
                >
                  {(body?.registerUsers || []).map((item, index) => {
                    if (index <= 2) return <Avatar circle={true} size="small" text={item.nickname} image={item.avatar} key={item.nickname} />;
                    return null;
                  })}
                  <span className={styles.m10}>{(body?.registerUsers || []).length}人已报名</span>
                </div>
                <Button
                  type="primary"
                  loading={this.state.loading}
                  className={classNames({
                    [styles.isregisterd]: isRegistered,
                  })}
                  onClick={this.handleActOperate}
                >
                  {isRegistered ? '取消报名' : '立即报名'}
                </Button>
              </div>
            )}
            {isCanNotApply && <Button full disabled className={styles.donebtn}>{this.getActStatusText()}</Button>}
          </div>
        </div>
        {popupShow && <PopupList
          isCustom
          visible={popupShow}
          onHidden={() => this.setState({ popupShow: false })}
          tipData={{ platform: siteData.platform }}
        />}
      </>
    );
  }
};

export default CustomApplyDisplay;
