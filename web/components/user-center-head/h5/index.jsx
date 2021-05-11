import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import styles from './index.module.scss';
import Avatar from '@components/avatar';
import { Button, Icon } from '@discuzq/design';
import clearLoginStatus from '@common/utils/clear-login-status';
import Router from '@discuzq/sdk/dist/router';
import { withRouter } from 'next/router';
@inject('user')
@observer
class index extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  static defaultProps = {
    isOtherPerson: false, // 表示是否是其他人
  }

  // 点击屏蔽
  handleChangeShield = () => {

  }

  // 点击关注
  handleChangeAttention = () => {

  }

  logout = () => {
    clearLoginStatus();
    window.location.replace('/');
  }

  // 点击粉丝列表
  goToFansList = () => {
    const { query } = this.props.router
    if (query.otherId) {
      Router.push({ url: `/my/fans?isOtherPerson=${this.props.isOtherPerson}&otherId=${query.otherId}` })
    } else {
      Router.push({ url: `/my/fans?isOtherPerson=${this.props.isOtherPerson}` })
    }
  }

  // 点击关注列表
  goToFollowsList = () => {
    const { query } = this.props.router
    console.log(this.props.router);
    if (query.otherId) {
      Router.push({ url: `/my/follows?isOtherPerson=${this.props.isOtherPerson}&otherId=${query.otherId}` })
    } else {
      Router.push({ url: `/my/follows?isOtherPerson=${this.props.isOtherPerson}` })
    }
  }

  // 点击编辑资料
  goToMyEditInfo = () => {
    Router.push({ url: `my/edit` })
  }

  render() {
    const { targetUser } = this.props.user;
    const user = this.props.isOtherPerson ? targetUser || {} : this.props.user;
    return (
      <div className={styles.h5box}>
        {/* 上 */}
        <div className={styles.h5boxTop}>
          <div className={styles.headImgBox}>
            <Avatar image={user.avatarUrl} size='big' name={user.username} />
          </div>
          {/* 粉丝|关注|点赞 */}
          <div className={styles.userMessageList}>
            <div onClick={this.goToFansList} className={styles.userMessageListItem}>
              <span>粉丝</span>
              <span>{user.fansCount || 0}</span>
            </div>
            <div onClick={this.goToFollowsList} className={styles.userMessageListItem}>
              <span>关注</span>
              <span>{user.followCount || 0}</span>
            </div>
            <div className={styles.userMessageListItem}>
              <span>点赞</span>
              <span>{user.likedCount || 0}</span>
            </div>
          </div>
        </div>
        {/* 中 用户昵称和他所在的用户组名称 */}
        <div>
          <div className={styles.userNameOrTeam}>
            <span>{user.username}</span>
            <span>{user.group?.groupName}</span>
          </div>
          <p className={styles.text}>{user.signature || '这个人很懒，什么也没留下~'}</p>
        </div>
        {/* 下 */}
        <div className={styles.userBtn}>
          {
            this.props.isOtherPerson ? (
              <>
                <Button onClick={this.handleChangeAttention} type="primary">
                  <Icon name={user.follow !== 0 ? "CheckOutlined" : "PlusOutlined"} />
                  <span className={styles.userBtnText}>{user.follow ? '已关注' : '关注'}</span>
                </Button>
                <Button>
                  <Icon name="NewsOutlined" />
                  <span className={styles.userBtnText}>发私信</span>
                </Button>
              </>
            ) : (
              <>
                <Button onClick={this.goToMyEditInfo} type="primary">
                  <Icon name="CompileOutlined" />
                  <span className={styles.userBtnText}>编辑资料</span>
                </Button>
                <Button onClick={this.logout}>
                  <Icon name="PoweroffOutlined" />
                  <span className={styles.userBtnText}>退出登录</span>
                </Button>
              </>
            )
          }
        </div>
        {/* 右上角屏蔽按钮 */}
        {
          this.props.isOtherPerson && (
            <div onClick={this.handleChangeShield} className={styles.shieldBtn}>
              <Icon name="ShieldOutlined" />
              <span>{user.isDeny ? '解除屏蔽' : '屏蔽'}</span>
            </div>
          )
        }
      </div>
    );
  }
}

export default withRouter(index)
