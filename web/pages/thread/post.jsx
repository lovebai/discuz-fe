import React from 'react';
import { inject, observer } from 'mobx-react';
import Head from 'next/head';
import IndexH5Page from '@layout/thread/post/h5';
import IndexPCPage from '@layout/thread/post/pc';
import HOCTencentCaptcha from '@middleware/HOCTencentCaptcha';
import HOCFetchSiteData from '@middleware/HOCFetchSiteData';
import HOCWithLogin from '@middleware/HOCWithLogin';
import * as localData from '@common/utils/thread-post-localdata';
import { Toast } from '@discuzq/design';
import { THREAD_TYPE, MAX_COUNT, THREAD_STATUS } from '@common/constants/thread-post';
import Router from '@discuzq/sdk/dist/router';
import PayBox from '@components/payBox/index';
import { ORDER_TRADE_TYPE } from '@common/constants/payBoxStoreConstants';
import { withRouter } from 'next/router';
import { tencentVodUpload } from '@common/utils/tencent-vod';
import { plus } from '@common/utils/calculate';
import { defaultOperation } from '@common/constants/const';
import ViewAdapter from '@components/view-adapter';
import commonUpload from '@common/utils/common-upload';
import { formatDate } from '@common/utils/format-date';
import typeofFn from '@common/utils/typeof';

@inject('site')
@inject('threadPost')
@inject('index')
@inject('thread')
@inject('user')
@inject('payBox')
@inject('vlist')
@inject('baselayout')
@inject('threadList')
@observer
class PostPage extends React.Component {
  toastInstance = null;

  constructor(props) {
    super(props);
    this.state = {
      postType: 'isFirst', // 发布状态 isFirst-首次，isEdit-再编辑，isDraft-草稿
      canEditRedpacket: true, // 可编辑红包
      canEditReward: true, // 可编辑悬赏
      emoji: {},
      // 分类选择显示状态
      categoryChooseShow: false,
      atList: [],
      topic: '',
      isVditorFocus: false,
      // 当前默认工具栏的操作 @common/constants/const defaultOperation
      currentDefaultOperation: '',
      // 当前附件工具栏的操作显示交互状态
      currentAttachOperation: false,
      // 解析完后显示商品信息
      productShow: false,
      // 语音贴上传成功的语音地址
      paySelectText: ['帖子付费', '附件付费'],
      curPaySelect: '',
      count: 0,
      draftShow: false,
      isTitleShow: true,
      jumpLink: '', // 退出页面时的跳转路径,默认返回上一页
      data: {}, // 创建帖子返回的数据
    };
    this.vditor = null;
    // 语音、视频、图片、附件是否上传完成。默认没有上传所以是上传完成的
    this.isAudioUploadDone = true;
    this.isVideoUploadDone = true;
    this.imageList = [];
    this.fileList = [];
    this.autoSaveInterval = null; // 自动保存计时器
  }

  componentDidMount() {
    this.props.threadPost.setThreadStatus(THREAD_STATUS.create);
    this.redirectToHome();
    this.props.router.events.on('routeChangeStart', this.handleRouteChange);
    this.fetchPermissions();
    const { fetchEmoji, emojis } = this.props.threadPost;
    if (emojis.length === 0) fetchEmoji();
    this.fetchDetail();
  }

  componentWillUnmount() {
    this.captcha = '';
    if (this.autoSaveInterval) clearInterval(this.autoSaveInterval);
    this.props.router.events.off('routeChangeStart', this.handleRouteChange);
  }

  componentDidUpdate() {
    this.redirectToHome();
  }

  redirectToHome() {
    if (!this.props.user.threadExtendPermissions.createThread) {
      Toast.info({ content: '您没有发帖权限，即将回到首页' });
      const timer = setTimeout(() => {
        clearTimeout(timer);
        this.props.router.replace('/');
      }, 1000);
    }
  }

  handleRouteChange = (url) => {
    // 如果不是修改支付密码的页面则重置发帖信息
    // 对于插件页面，也不清空信息
    if (
      (url || '').indexOf('/my/edit/paypwd') === -1
      && (url || '').indexOf('/pay/middle') === -1
      && (url || '').indexOf('/my/edit/find-paypwd') === -1
      && (url || '').indexOf('/plugin') === -1
      && (url || '').indexOf('/wallet/recharge') === -1
    ) {
      if (this.vditor) this.vditor.setValue('');
      this.props.threadPost.resetPostData();
    }
  };

  saveDataLocal = () => {
    const { threadPost, user } = this.props;
    localData.setThreadPostDataLocal({ postData: threadPost.postData, userId: user.userInfo.id });
  };

  // 从本地缓存中获取数据
  getPostDataFromLocal = () => localData.getThreadPostDataLocal(this.props.user.userInfo.id, this.props.router.query.id);

  removeLocalData = () => {
    localData.removeThreadPostDataLocal();
  };

  fetchPermissions() {
    const { user } = this.props;
    if (!user.permissions) user.updateUserInfo();
  }

  postToast = (content) => {
    Toast.info({ content, duration: 2000, hasMask: true });
  };

  async fetchDetail() {
    const { thread, threadPost } = this.props;
    // 如果是编辑操作，需要获取链接中的帖子id，通过帖子id获取帖子详情信息
    const { query } = this.props.router;
    if (query && query.id) {
      const id = Number(query.id);
      let ret = {};
      if (id === (thread.threadData && thread.threadData.id) && thread.threadData) {
        ret.data = thread.threadData;
        ret.code = 0;
      } else ret = await thread.fetchThreadDetail(id);
      if (ret.code === 0) {
        // 设置主题状态、是否能操作红包和悬赏
        // const { postData, isThreadPaid } = this.props.threadPost;
        const { postData } = this.props.threadPost;
        const { isDraft } = postData;
        // if (isThreadPaid) {
        //   Toast.info({ content: '已经支付的帖子不支持编辑', duration: 1000, hasMask: true });
        //   const timer = setTimeout(() => {
        //     clearTimeout(timer);
        //     this.props.router.replace(`/thread/${id}`);
        //   }, 1000);
        //   return;
        // }
        // 更改交互：已发布帖子可以编辑内容，但是不能编辑红包或者悬赏属性
        this.setState({
          postType: isDraft ? 'isDraft' : 'isEdit',
          canEditRedpacket: isDraft,
          canEditReward: isDraft,
        });
        const status = isDraft ? THREAD_STATUS.draft : THREAD_STATUS.edit;
        threadPost.setThreadStatus(status);
        threadPost.formatThreadDetailToPostData(ret.data);
      } else {
        Toast.error({ content: ret.msg });
      }
    }
    if (this.getPostDataFromLocal()) this.props.threadPost.setLocalDataStatus(true);
    this.autoSaveData();
  }

  setPostData(data) {
    const { threadPost } = this.props;
    threadPost.setPostData(data);
  }

  // 处理录音完毕后的音频上传
  handleAudioUpload = async (blob) => {
    // 开始语音的上传
    this.isAudioUploadDone = false;
    blob.name = `${new Date().getTime()}.mp3`;
    tencentVodUpload({
      file: blob,
      onUploading: () => {
        this.toastInstance = Toast.loading({
          content: '上传中...',
          duration: 0,
        });
      },
      onComplete: (res, file) => {
        this.handleVodUploadComplete(res, file, THREAD_TYPE.voice);
      },
      onError: (err) => {
        this.handleVodUploadComplete(null, blob, THREAD_TYPE.voice);
        Toast.error({ content: err.message });
      },
    });
  };

  // 上传视频之前判断是否已经有了视频，如果有了视频提示只能上传一个视频
  // 这个和选择文件之前的回调放到一起了，所以注意一下
  handleVideoUpload = (files) => {
    const { postData } = this.props.threadPost;
    if ((postData.video && postData.video.id) || (postData.iframe && postData.iframe.content)) {
      Toast.info({ content: '只能上传一个视频' });
      return false;
    }
    if (!files) return true;

    const [file] = files;
    let toastInstance = null;
    toastInstance = Toast.loading({
      content: '上传中...',
      duration: 0,
      hasMask: true,
    });
    tencentVodUpload({
      file,
      onUploading: () => {},
      onComplete: (res, file) => {
        this.handleVodUploadComplete(res, file, THREAD_TYPE.video);
        toastInstance?.destroy();
      },
      onError: (err) => {
        this.handleVodUploadComplete(null, file, THREAD_TYPE.video);
        Toast.error({ content: err.message });
        toastInstance?.destroy();
      },
    });
  };

  // 通过云点播上传成功之后处理：主要是针对语音和视频
  handleVodUploadComplete = async (ret, file, type) => {
    if (!ret) {
      this.isVideoUploadDone = true;
      this.isAudioUploadDone = true;
      return;
    }
    const { fileId, video } = ret;
    const params = {
      fileId,
      mediaUrl: video.url,
    };
    if (type === THREAD_TYPE.voice) params.type = 1;
    const result = await this.props.threadPost.createThreadVideoAudio(params);
    this.toastInstance?.destroy();
    const { code, data } = result;
    if (code === 0) {
      if (type === THREAD_TYPE.video) {
        this.setPostData({
          video: {
            id: data?.id,
            thumbUrl: data.mediaUrl,
            type: file.type,
          },
        });
        this.isVideoUploadDone = true;
        this.scrollIntoView('#dzq-post-video');
      } else if (type === THREAD_TYPE.voice) {
        // 语音上传并保存完成
        this.setPostData({
          audio: {
            id: data?.id,
            mediaUrl: data.mediaUrl,
            type: file.type,
          },
          audioSrc: data.mediaUrl,
          audioRecordStatus: 'uploaded',
        });
        this.isAudioUploadDone = true;
      }
    } else {
      this.isVideoUploadDone = true;
      this.isAudioUploadDone = true;
      Toast.error({ content: result.msg });
    }
  };

  // 表情
  handleEmojiClick = (emoji) => {
    this.setState({ emoji });
  };

  // 附件相关icon
  /**
   * 点击附件相关icon
   * @param {object} item 附件相关icon
   * @param {object} data 要设置的数据
   */
  handleAttachClick = (item, data) => {
    this.setState({ currentDefaultOperation: '' });
    if (!this.checkAudioRecordStatus()) return;

    const { isPc } = this.props.site;
    if (!isPc && item.type === THREAD_TYPE.voice) {
      const u = navigator.userAgent.toLocaleLowerCase();

      // iphone设备降级流程
      if (u.indexOf('iphone') > -1) {
        // 判断是否在微信内
        if (u.indexOf('micromessenger') > -1) {
          Toast.info({ content: 'iOS版微信暂不支持录音功能' });
          return;
        }

        // 判断ios版本号
        const v = u.match(/cpu iphone os (.*?) like mac os/);
        if (v) {
          const version = v[1].replace(/_/g, '.').split('.')
            .splice(0, 2)
            .join('.');
          if (
            Number(version) < 14.3
            && !(u.indexOf('safari') > -1 && u.indexOf('chrome') < 0 && u.indexOf('qqbrowser') < 0 && u.indexOf('360') < 0)
          ) {
            Toast.info({ content: 'iOS版本太低，请升级至iOS 14.3及以上版本或使用Safari浏览器访问' });
            return;
          }
        }
      }

      // uc浏览器降级流程
      if (u.indexOf('ucbrowser') > -1) {
        Toast.info({ content: '此浏览器暂不支持录音功能' });
        return;
      }
      // this.setState({ curPaySelect: THREAD_TYPE.voice })
    }

    const { postData } = this.props.threadPost;

    if (item.type === THREAD_TYPE.reward && !this.state.canEditReward) {
      Toast.info({ content: '悬赏内容不可编辑' });
      return false;
    }

    if (item.type === THREAD_TYPE.vote && postData?.vote?.voteUsers > 0) {
      Toast.info({ content: '投票已生效，不允许编辑' });
      return false;
    }

    if (item.type === THREAD_TYPE.video) {
      // 本地上传的视频和网络插入的iframe是互斥的关系
      if ((postData.video && postData.video.id) || (postData.iframe && postData.iframe.content)) {
        Toast.info({ content: '只能上传一个视频' });
        return false;
      }
    }

    if (item.type === THREAD_TYPE.anonymity) {
      if (postData.anonymous) this.setPostData({ anonymous: 0 });
      else this.setPostData({ anonymous: 1 });
    }

    if (data) {
      this.setPostData(data);
      return false;
    }
    this.props.threadPost.setCurrentSelectedToolbar(item.type);
    this.setState({ currentAttachOperation: item.type }, () => {
      if (item.type === THREAD_TYPE.image) {
        this.scrollIntoView('.dzq-post-image-upload');
      }
      if (item.type === THREAD_TYPE.voice) {
        this.scrollIntoView('#dzq-post-audio-record');
      }
    });
  };

  // 滚动到可视区
  scrollIntoView = (id) => {
    const timer = setTimeout(() => {
      clearTimeout(timer);
      let rect = {};
      const elem = document.querySelector(id);
      if (elem) rect = elem.getBoundingClientRect();
      const top = rect.y || 0;
      this.handleEditorBoxScroller(top);
    }, 0);
  };

  // 表情等icon
  handleDefaultIconClick = (item, child, data) => {
    if (!this.checkAudioRecordStatus()) return;

    const { postData } = this.props.threadPost;

    if (item.type === THREAD_TYPE.redPacket && !this.state.canEditRedpacket) {
      this.setState({ currentDefaultOperation: item.id }, () => {
        this.setState({ currentDefaultOperation: '' });
        this.postToast('红包内容不能编辑');
      });
      return false;
    }

    if (data) {
      this.setPostData(data);
      return false;
    }
    if (child && child.id) {
      const content = '帖子付费和附件付费不能同时设置';
      if (postData.price && child.id === '附件付费') {
        this.postToast(content);
        return false;
      }
      if (postData.attachmentPrice && child.id === '帖子付费') {
        Toast.error({ content });
        return false;
      }
      this.setState({ currentDefaultOperation: item.id, curPaySelect: child.id, emoji: {} });
    } else {
      this.setState({ currentDefaultOperation: item.id, emoji: {} }, () => {
        if (item.id === defaultOperation.attach) {
          this.scrollIntoView('.dzq-post-file-upload');
        }
      });
    }
  };

  checkFileType = (file, supportType) => {
    const { name, imageType } = file;
    let prefix = imageType;
    if (!imageType) {
      const arr = (name || '')?.toLowerCase()?.split('.');
      prefix = arr[arr.length - 1];
    }
    if (supportType.indexOf(prefix) === -1) return false;
    return true;
  };

  // 附件、图片上传之前
  beforeUpload = (cloneList, showFileList, type) => {
    const { webConfig } = this.props.site;
    if (!webConfig) return false;
    // 站点支持的文件类型、文件大小
    const { supportFileExt, supportImgExt, supportMaxSize } = webConfig.setAttach;
    const { qcloudCos } = webConfig.qcloud;

    let photoMaxSize = supportMaxSize;
    if (type === THREAD_TYPE.image && qcloudCos) {
      photoMaxSize = supportMaxSize > 15 ? 15 : supportMaxSize;
    }

    const remainLength = 9 - showFileList.length; // 剩余可传数量
    cloneList.splice(remainLength, cloneList.length - remainLength);

    let isAllLegalType = true; // 状态：此次上传图片是否全部合法
    let isAllLegalSize = true;
    for (let i = 0; i < cloneList.length; i++) {
      const imageSize = cloneList[i].size;
      const isLegalType =        type === THREAD_TYPE.image
        ? this.checkFileType(cloneList[i], supportImgExt)
        : this.checkFileType(cloneList[i], supportFileExt);
      const isLegalSize = imageSize > 0 && imageSize < photoMaxSize * 1024 * 1024;

      // 存在不合法图片时，从上传图片列表删除
      if (!isLegalType || !isLegalSize) {
        cloneList.splice(i, 1);
        i = i - 1;
        if (!isLegalType) isAllLegalType = false;
        if (!isLegalSize) isAllLegalSize = false;
      }
    }
    const supportExt = type === THREAD_TYPE.image ? supportImgExt : supportFileExt;
    const name = type === THREAD_TYPE.file ? '附件' : '图片';
    !isAllLegalType && Toast.info({ content: `仅支持${supportExt}类型的${name}` });
    !isAllLegalSize && Toast.info({ content: `大小在0到${photoMaxSize}MB之间` });
    if (type === THREAD_TYPE.file) this.fileList = [...cloneList];
    if (type === THREAD_TYPE.image) this.imageList = [...cloneList];

    return true;
  };

  // 附件和图片上传
  handleUploadChange = (fileList, type) => {
    const { postData } = this.props.threadPost;
    const { images, files } = postData;
    const changeData = {};
    (fileList || []).map((item) => {
      let tmp = images[item.id] || images[item.uid];
      if (type === THREAD_TYPE.file) tmp = files[item.id] || files[item.uid];
      if (tmp) {
        if (item.id) changeData[item.id] = tmp;
        else changeData[item.uid] = tmp;
      } else {
        changeData[item.uid] = item;
      }
      return item;
    });
    if (type === THREAD_TYPE.image) this.setPostData({ images: changeData });
    if (type === THREAD_TYPE.file) this.setPostData({ files: changeData });
  };

  // 附件和图片上传完成之后的处理
  handleUploadComplete = (ret, file, type) => {
    this.imageList = this.imageList.filter(item => item.uid !== file.uid);
    this.fileList = this.fileList.filter(item => item.uid !== file.uid);
    if (ret.code !== 0) {
      const msg = ret.code === 413 ? '上传大小超过了服务器限制' : ret.msg;
      Toast.error({ content: `上传失败：${msg}` });
      return false;
    }
    const { uid } = file;
    const { data } = ret;
    const { postData } = this.props.threadPost;
    const { images, files } = postData;
    if (type === THREAD_TYPE.image) {
      images[uid] = data;
    }
    if (type === THREAD_TYPE.file) {
      files[uid] = data;
    }
    this.setPostData({ images, files });
  };

  // 视频准备上传
  onVideoReady = (player) => {
    const { postData } = this.props.threadPost;
    // 兼容本地视频的显示
    const opt = {
      src: postData.video.thumbUrl,
      type: postData.video.type,
    };
    player && player.src(opt);
  };

  // 编辑器
  handleVditorChange = (vditor, event) => {
    if (vditor) {
      this.vditor = vditor;
      const htmlString = vditor.getHTML();
      this.setPostData({ contentText: htmlString, isResetContentText: false });
      if (!this.props.threadPost.postData.title) {
        if (!this.state.isTitleShow || this.props.site.platform === 'pc' || !event) return;
        this.setState({ isTitleShow: false });
      }
    }
  };

  handleVditorInit = (vditor) => {
    if (vditor) this.vditor = vditor;
  };

  handleVditorFocus = () => {
    if (this.vditor) this.vditor.focus();
  };

  // 关注列表
  handleAtListChange = (atList) => {
    this.setState({ atList });
  };

  checkAttachPrice = () => {
    const { postData } = this.props.threadPost;
    // 附件付费设置了需要判断是否进行了附件的上传
    if (postData.attachmentPrice) {
      if (
        !(
          postData.audio.id
          || postData.video.id
          || Object.keys(postData.images)?.length
          || Object.keys(postData.files)?.length
        )
      ) return false;
      return true;
    }
    return true;
  };

  checkAudioRecordStatus() {
    const {
      threadPost: { postData },
    } = this.props;
    const { audioRecordStatus } = postData;
    // 判断录音状态
    if (audioRecordStatus === 'began') {
      Toast.info({ content: '您有录制中的录音未处理，请先上传或撤销录音', duration: 3000 });
      return false;
    }
    if (audioRecordStatus === 'completed') {
      Toast.info({ content: '您有录制完成的录音未处理，请先上传或撤销录音', duration: 3000 });
      return false;
    }

    return true;
  }
}

// eslint-disable-next-line new-cap
export default HOCTencentCaptcha(HOCFetchSiteData(HOCWithLogin(withRouter(PostPage))));
