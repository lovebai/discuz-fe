import React from 'react';
import Taro, { getCurrentInstance } from '@tarojs/taro';
import Router from '@discuzq/sdk/dist/router';
import Page from '@components/page';
import { inject } from 'mobx-react';
import ThreadMiniPage from '@layout/thread/index';
// import PayBoxProvider from '@components/payBox/payBoxProvider';
import withShare from '@common/utils/withShare/withShare';
import ErrorMiniPage from '../../layout/error/index';
import { priceShare } from '@common/utils/priceShare';
import { updateViewCountInStorage } from '@common/utils/viewcount-in-storage';

// const MemoToastProvider = React.memo(ToastProvider);
@inject('site')
@inject('thread')
@inject('user')
@inject('index')
@inject('search')
@inject('topic')
@inject('baselayout')
@withShare()
class Detail extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isServerError: false,
      serverErrorMsg: '',
    };
  }

  componentDidHide() {
    const { baselayout } = this.props;

    const playingAudioDom = baselayout?.playingAudioDom;

    if(playingAudioDom) {
      baselayout.playingAudioDom.pause();
      baselayout.playingAudioDom = null;
    }
  }

  componentDidUpdate(prevProps) {
    if (this.props.router?.query?.id && this.props.router.query.id !== prevProps.router.query.id) {
      this.props.thread.reset();
      this.getPageDate(this.props.router.query.id);
    }
  }

  // 页面分享
  getShareData(data) {
    const { threadId, isAnonymous } = this.props.thread.threadData;
    const {isPrice} = this.props.thread.threadData.displayTag
    const defalutTitle = this.props.thread.title;
    const path = `/indexPages/thread/index?id=${threadId}`;
    if (data.from === 'timeLine') {
      return {
        title: defalutTitle,
      };
    }
    if (data.from === 'menu')  {
      return priceShare({isAnonymous, isPrice, path}) || {
        title: defalutTitle,
        path,
      };
    }
    this.props.thread.shareThread(threadId, this.props.index, this.props.search, this.props.topic);

    return  priceShare({isAnonymous, isPrice, path}) || {
      title: defalutTitle,
      path,
    };
  }

  updateViewCount = async (id) => {
    const { site } = this.props;
    const { openViewCount } = site?.webConfig?.setSite || {};
    const viewCountMode = Number(openViewCount);

    const threadId = Number(id);
    const viewCount = await updateViewCountInStorage(threadId, viewCountMode === 0);
    if (viewCount) {
      this.props.thread.updateViewCount(viewCount);
      this.props.index.updateAssignThreadInfo(threadId, {
        updateType: 'viewCount',
        updatedInfo: { viewCount },
      });
      this.props.search.updateAssignThreadInfo(threadId, {
        updateType: 'viewCount',
        updatedInfo: { viewCount },
      });
      this.props.topic.updateAssignThreadInfo(threadId, {
        updateType: 'viewCount',
        updatedInfo: { viewCount },
      });
    }
  };

  async componentDidShow() {
    const { id } = getCurrentInstance().router.params;
    
    // 判断缓存
    // const oldId = this.props?.thread?.threadData?.threadId;
    // if (Number(id) === oldId && id && oldId) {
    //   return;
    // }
    // this.props.thread.reset();

    if (id) {
      await this.getPageDate(id);
      this.updateViewCount(id);
    }
  }

  // 尝试从列表中获取帖子数据
  async getThreadDataFromList(id) {
    if (id) {
      let threadData;
      // 首页iebook
      const indexRes = this.props.index.findAssignThread(Number(id));
      threadData = indexRes?.data;

      // 发现列表
      if (!threadData) {
        const searchRes = this.props.search.findAssignThread(Number(id));
        threadData = searchRes[0]?.data;
      }

      // 话题列表
      if (!threadData) {
        const topicRes = this.props.topic.findAssignThread(Number(id));
        threadData = topicRes?.data;
      }

      if (threadData?.threadId) {
        this.props.thread.setThreadData(threadData);
      }
    }
  }

  async getPageDate(id) {
    // 先尝试从列表store中获取帖子数据
    this.getThreadDataFromList(id);

    if (!this.props?.thread?.threadData) {
      const res = await this.props.thread.fetchThreadDetail(id);

      if (res.code !== 0) {
        // 404
        if (res.code === -4004) {
          Router.replace({ url: '/subPages/404/index' });
          return;
        }

        if (res.code > -5000 && res.code < -4000) {
          this.setState({
            serverErrorMsg: res.msg,
          });
        }

        this.setState({
          isServerError: true,
        });
        return;
      }

      // 判断是否审核通过
      const isApproved = (this.props.thread?.threadData?.isApproved || 0) === 1;
      if (!isApproved) {
        const currentUserId = this.props.user?.userInfo?.id; // 当前登录用户
        const userId = this.props.thread?.threadData?.user?.userId; // 帖子作者
        // 不是作者自己。跳回首页
        if (!currentUserId || !userId || currentUserId !== userId) {
          Taro.redirectTo({
            url: `/indexPages/home/index`,
          });
          return;
        }
      }
    }
    if (!this.props?.thread?.commentList) {
      const params = {
        id,
      };
      this.props.thread.loadCommentList(params);
    }
  }

  render() {
    return this.state.isServerError ? (
      <ErrorMiniPage text={this.state.serverErrorMsg} />
    ) : (
      <Page>
        <ThreadMiniPage></ThreadMiniPage>
      </Page>
    );
  }
}

// eslint-disable-next-line new-cap
export default Detail;
