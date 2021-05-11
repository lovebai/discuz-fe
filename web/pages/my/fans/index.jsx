import React, { Component } from 'react'
import { inject, observer } from 'mobx-react';
import Header from '@components/header';
import UserCenterFans from '@components/user-center-fans'
import { Divider, Toast } from '@discuzq/design'
import styles from './index.module.scss'
import { withRouter } from 'next/router';
import Router from '@discuzq/sdk/dist/router';

@inject('user')
@observer
class index extends Component {

  // 点击关注
  followHandler = async ({ id }) => {
    try {
      await this.props.user.postFollow(id)
      Toast.success({
        content: '关注成功',
        hasMask: false,
        duration: 1000,
      })
      this.props.user.setUserFansBeFollowed(id)
    } catch (error) {

    }
  }

  // 取消关注
  unFollowHandler = async ({ id }) => {
    try {
      await this.props.user.cancelFollow({ id, type: 1 })
      this.props.user.setUserFansBeUnFollowed(id);
      Toast.success({
        content: '取消成功',
        hasMask: false,
        duration: 1000,
      })
    } catch (error) {

    }
  }

  onContainerClick = ({id}) => {
    Router.push({url: `/my/others?otherId=${id}`})
  }

  splitElement = () => {
    return (
      <div className={styles.splitEmelent}>
        <Divider />
      </div>
    )
  }

  render() {
    const { query } = this.props.router
    let flag = query && query.isOtherPerson
    return (
      <div style={{
        height: '100%'
      }}>
        <Header />
        {
          !flag ? (
            <UserCenterFans
              friends={this.props.user.userFans}
              loadMorePage={true}
              loadMoreAction={this.props.user.getUserFans}
              hasMorePage={this.props.user.userFansTotalPage < this.props.user.userFansPage}
              followHandler={this.followHandler}
              unFollowHandler={this.unFollowHandler}
              splitElement={this.splitElement()}
              onContainerClick={this.onContainerClick}
            />
          ) : (
            <UserCenterFans
              friends={this.props.user.targetUserFans}
              loadMorePage={true}
              loadMoreAction={this.props.user.getTargetUserFans}
              hasMorePage={this.props.user.userFansTotalPage < this.props.user.targetUserFansPage}
              followHandler={this.followHandler}
              unFollowHandler={this.unFollowHandler}
              splitElement={this.splitElement()}
              onContainerClick={this.onContainerClick}
            />
          )
        }
      </div>
    )
  }
}

export default withRouter(index)
