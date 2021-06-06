import React from 'react';
import { inject, observer } from 'mobx-react';
import { withRouter } from 'next/router';
import '@discuzq/design/dist/styles/index.scss';
import HomeHeader from '@components/home-header';
import List from '@components/list';
import { Button, Toast, Avatar, Spin } from '@discuzq/design';
import { get } from '@common/utils/get';
import PopularContents from '../../../search/h5/components/popular-contents';
import SiteInfo from './site-info';
import { inviteDetail } from '@server';
import goToLoginPage from '@common/utils/go-to-login-page';
import PayBox from '@components/payBox';
import { simpleRequest } from '@common/utils/simple-request';
import { numberFormat } from '@common/utils/number-format';
import { getSiteUpdateTime } from '@common/utils/get-site-uptade-time';
import PartnerInviteWrap from './partner-invite-wrap';
import Copyright from '@components/copyright';
import PartnerInviteHot from './partner-invite-hot';
import PartnerInviteUser from './partner-invite-user';
import pclayout from './pc.module.scss';
import mlayout from './index.module.scss';

@inject('site')
@inject('index')
@inject('forum')
@inject('search')
@inject('user')
@inject('invite')
@observer
class PartnerInviteH5Page extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      invitorName: '',
      invitorAvatar: '/dzq-img/login-user.png',
    };
  }
  async componentDidMount() {
    try {
      const { forum, router, search, invite, site } = this.props;
      const { platform } = site;
      const perPage = platform === 'pc' ? 5 : 20;

      const inviteCode = invite.getInviteCode(router);
      if (inviteCode) invite.setInviteCode(inviteCode);

      const usersList = await simpleRequest('readUsersList', {
        params: {
          perPage,
          filter: {
            hot: 1,
          },
        },
      });
      forum.setUsersPageData(usersList);

      const threadList = await search.getThreadList();
      forum.setThreadsPageData(threadList);

      const inviteResp = await inviteDetail({
        params: {
          code: inviteCode,
        },
      });
      const nickname = get(inviteResp, 'data.user.nickname', '');
      const avatar = get(inviteResp, 'data.user.avatar', '');

      this.setState({
        invitorName: nickname,
        invitorAvatar: avatar,
      });

      forum.setIsLoading(false);
    } catch (e) {
      Toast.error({
        content: e?.Message || e,
        hasMask: false,
        duration: 1000,
      });
    }
  }

  handleJoinSite = () => {
    const { user, site } = this.props;
    if (!user?.isLogin()) {
      goToLoginPage({ url: '/user/login' });
      return;
    }
    const { setSite: { siteMode, sitePrice, siteName } = {} } = site.webConfig;
    if (siteMode === 'pay' && user.paid === false) {
      PayBox.createPayBox({
        data: {      // data 中传递后台参数
          amount: sitePrice,
          title: siteName,
          type: 1, // 站点付费注册
        },
        isAnonymous: false, // 是否匿名
        success: (orderInfo) => {
          Toast.success({
            content: `订单 ${orderInfo.orderSn} 支付成功, 即将进入站点`,
            hasMask: false,
            duration: 3000,
            onClose() {
              window.location.href = '/';
            },
          });
        }, // 支付成功回调
        failed: (orderInfo) => {
          Toast.error({
            content: `订单 ${orderInfo.orderSn} 支付失败`,
            hasMask: false,
            duration: 2000,
          });
        }, // 支付失败回调
        completed: (orderInfo) => {}, // 支付完成回调(成功或失败)
      });
      return;
    }
    window.location.href = '/';
  }

  // 右侧 - 潮流话题 粉丝 版权信息
  renderRight = () => {
    const { inviteData } = this.props.invite;
    const { site: { platform, webConfig }, forum } = this.props;
    const { invitorName, invitorAvatar } = this.state;
    const { setSite: { siteMode, sitePrice, siteMasterScale, siteExpire } = {} } = webConfig;
    const { updataTime } = forum;
    const layout = platform === 'h5' ? mlayout : pclayout;
    const { inviteCode } = this.props.router.query;
    // 内容数
    const countThreads = get(webConfig, 'other.countThreads', '');
    if (platform === 'h5') {
      return <></>;
    }
    const username = get(webConfig, 'setSite.siteAuthor.username', '');
    const avatar = get(webConfig, 'setSite.siteAuthor.avatar', '');
    // 站点介绍
    return (
      <>
        <div className={layout.user_card_wrap}>
          <div className={layout.user_card_main}>
            <div className={layout.user_card_avatar}>
              <Avatar
                size={'big'}
                image={avatar}
                text={username && username.substring(0, 1)}
              />
            </div>
            <div className={layout.user_card_info}>
              <div className={layout.user_info_name}>{username}</div>
              <div className={layout.user_info_tag}>站长</div>
              <div className={layout.site_info}>
                <div className={layout.site_status_list}>
                    <span className={layout.site_status_label}>更新</span>
                    <span
                      className={layout.site_status_item}
                      title={(updataTime && getSiteUpdateTime(updataTime)) || '--'}
                    >
                      {(updataTime && getSiteUpdateTime(updataTime)) || '--'}
                    </span>
                </div>
                <div className={layout.site_status_list}>
                    <span className={layout.site_status_label}>成员</span>
                    <span
                      className={layout.site_status_item}
                      title={numberFormat(webConfig?.other?.countUsers) || '--'}
                    >
                      {numberFormat(webConfig?.other?.countUsers) || '--'}
                    </span>
                </div>
                <div className={layout.site_status_list}>
                    <span className={layout.site_status_label}>主题</span>
                    <span
                      className={layout.site_status_item}
                      title={numberFormat(countThreads) || '--'}
                    >
                      {numberFormat(countThreads) || '--'}
                    </span>
                </div>
              </div>
            </div>
          </div>
          {
            inviteCode
              ? <div className={layout.pc_bottom_tips}>
                  <Avatar
                    size='small'
                    text={ invitorName?.substring(0, 1)}
                    className={layout.pc_bottom_img}
                    image={ invitorAvatar }/>
                  <span className={layout.pc_bottom_text}>
                    <span>{ invitorName } 邀请您加入站点</span>
                    {siteMode === 'pay' ? <span>，可获得返现 ¥{((10 - siteMasterScale) * sitePrice / 10).toFixed(2)}</span> : ''}
                  </span>
              </div>
              : <></>
          }
          <div className={layout.user_card_button} onClick={this.handleJoinSite}>{siteMode === 'pay' ? `¥ ${sitePrice}` : ''} 立即加入</div>
          {(siteMode === 'pay' && siteExpire) ? <div className={layout.bottom_title}>有效期：<span>{siteExpire}天</span></div> : <></>}
        </div>
        <Copyright/>
      </>
    );
  }

  render() {
    const { site: { platform, webConfig }, forum: { updataTime } } = this.props;
    const { inviteCode } = this.props.router.query;
    const { setSite: { siteMode, siteExpire, sitePrice, siteMasterScale } = {} } = webConfig;
    const { invitorName, invitorAvatar } = this.state;
    const layout = platform === 'h5' ? mlayout : pclayout;
    // 内容数
    const countThreads = get(webConfig, 'other.countThreads', '');
    return (
      <PartnerInviteWrap renderRight={this.renderRight}>
        <div className={layout.content}>
          {/* 站点信息 start */}
          <SiteInfo threadTotal={countThreads} updataTime={ updataTime }/>
          {/* 站点信息 end */}
          {/* 站点用户 start */}
          <PartnerInviteUser/>
          {/* 站点用户 end */}
          {/* 热门内容预览 start */}
          <PartnerInviteHot/>
          {/* 热门内容预览 end */}
          {
            platform === 'h5'
              ? (
                <>
                <div className={layout.bottom}>
                  {
                    inviteCode
                      ? <div className={layout.bottom_tips}>
                          {/* <img className={layout.bottom_tips_img} src={ invitorAvatar } alt=""/> */}
                          <Avatar
                            size='small'
                            text={ invitorName?.substring(0, 1)}
                            className={layout.bottom_tips_img}
                            image={ invitorAvatar }/>
                          <span className={layout.bottom_tips_text}>
                            <span>{ invitorName } 邀请您加入站点</span>
                            {siteMode === 'pay' ? <span>，可获得返现 ¥{((10 - siteMasterScale) * sitePrice / 10).toFixed(2)}</span> : ''}
                          </span>
                          <span className={layout.bottom_tips_arrows}></span>
                      </div>
                      : <></>
                  }
                  {(siteMode === 'pay' && siteExpire) ? <div className={layout.bottom_title}>有效期：<span>{siteExpire}天</span></div> : <></>}
                  <Button className={layout.bottom_button} onClick={this.handleJoinSite}>
                    {siteMode === 'pay' ? `¥${sitePrice}` : ''} 立即加入
                  </Button>
                </div>
                </>
              )
              : <></>
          }
        <div className={layout.maskLayer}></div>
        </div>
      </PartnerInviteWrap>
    );
  }
}

export default withRouter(PartnerInviteH5Page);
