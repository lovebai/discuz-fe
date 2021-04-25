import React, { Component } from 'react';
import Taro from '@tarojs/taro';
import { View } from '@tarojs/components';
import { observer, inject } from 'mobx-react';
import ThemePage from '@components/theme-page';
import { PlusinToolbar, DefaultToolbar, GeneralUpload, Tag, Title, Content, ClassifyPopup } from '@components/thread-post';
import { Units } from '@components/common';
import styles from './index.module.scss';
import { THREAD_TYPE } from '@common/constants/thread-post';
import { readYundianboSignature } from '@common/server';
import VodUploader from 'vod-wx-sdk-v2';

@inject('index')
@inject('site')
@inject('threadPost')
@observer
class Index extends Component {
  constructor() {
    super();
    this.state = {
      postType: 'post', // 发布类型 post-首次发帖，edit-再次编辑，draft-草稿
      title: '',
      isShowTitle: true, // 默认显示标题
      showClassifyPopup: false, // 切换分类弹框show
      operationType: 0,
    }
  }
  componentWillMount() { }

  componentDidMount() {
    this.fetchCategories();
  }

  componentWillUnmount() { }

  componentDidShow() { }

  componentDidHide() { }

  fetchCategories() { // 若当前store内分类列表数据为空，则主动发起请求
    const { categories, getReadCategories } = this.props.index;
    if (!categories || (categories && categories?.length === 0)) {
      getReadCategories();
    }
  }

  // handle
  onTitleInput = (title) => {
    const { setPostData } = this.props.threadPost;
    setPostData({ title });
  }

  onContentChange = (contentText) => { // 处理文本框内容
    const { setPostData } = this.props.threadPost;
    setPostData({ contentText });
  }

  onContentFocus = () => {
    // 首次发帖，文本框聚焦时，若标题为空，则此次永久隐藏标题输入
    const { postData } = this.props.threadPost;
    if (this.state.postType === 'post' && postData.title === "") {
      this.setState({ isShowTitle: false })
    }
  }

  onClassifyChange = ({ parent, child }) => { // 设置当前选中分类、分类id
    const { setPostData, setCategorySelected } = this.props.threadPost;
    setPostData({ categoryId: child.pid || parent.pid });
    setCategorySelected({ parent, child });
  }

  handlePlusinClick(item) {
    this.setState({
      operationType: item.type
    });

    switch (item.type) {
      //  其它类型可依次补充
      case THREAD_TYPE.reward:
        Taro.navigateTo({
          url: '/pages/threadPost/selectReward'
        });
        break;
      case THREAD_TYPE.goods:
        Taro.navigateTo({
          url: '/pages/threadPost/selectProduct'
        });
        break;
      case THREAD_TYPE.video:
        this.handleVideoUpload();
        break;
    }
  }

  getYundianboSignature = async (fn) => {
    const res = await readYundianboSignature();
    const { code, data } = res;
    const signature = code === 0 ? data.token : '';
    fn(signature);
  }

  // 执行视频上传
  handleVideoUpload = () => {
    const { setPostData } = this.props.threadPost;
    Taro.chooseVideo({
      success: (file) => {
        Taro.showLoading({
          title: '上传中',
        });
        // 执行云点播相关的上传工作
        VodUploader.start({
          // 必填，把 wx.chooseVideo 回调的参数(file)传进来
          mediaFile: file,
          // 必填，获取签名的函数
          getSignature: this.getYundianboSignature,
          // 上传中回调，获取上传进度等信息
          progress: function(result) {
            console.log('progress');
            console.log(result);
          },
          // 上传完成回调，获取上传后的视频 URL 等信息
          finish: function(result) {
            Taro.hideLoading();
            setPostData({
              video: result
            });
            console.log('finish');
            console.log(result);
          },
          // 上传错误回调，处理异常
          error: function(result) {
            console.log('error');
            console.log(result);
          },
        });
      }
    });
  }

  rewardContent = () => { // 悬赏内容
    const { rewardQa: { price, expiredAt } } = this.props.threadPost.postData;
    return (price && expiredAt) ? `悬赏金额${price}元\\结束时间${expiredAt}` : ''
  }

  render() {
    const { categories } = this.props.index;
    const { envConfig, theme, changeTheme } = this.props.site;
    const { postData } = this.props.threadPost;
    const { video } = postData;
    const {
      title,
      isShowTitle,
      showClassifyPopup,
      operationType,
    } = this.state;

    return (
      <ThemePage>
        {/* 文本框区域，inclue标题、帖子文字内容等 */}
        <View>
          <Title title={title} show={isShowTitle} onInput={this.onTitleInput} />
          <Content
            value={postData.content}
            onChange={this.onContentChange}
            onFocus={this.onContentFocus}
          />
        </View>

        {/* 插件区域、include图片、附件、语音等 */}
        <View className={styles['plusin']}>

          <GeneralUpload type={operationType} />

          <Units type='product' productSrc={'https://img20.360buyimg.com/ceco/s700x700_jfs/t1/153702/29/15780/81514/601663b6E0eb5908f/3cb05e84fe495b03.jpg!q70.jpg'} productDesc={'又帅又痞 设计师日本纯钛眼镜框超轻近视男款复古镜架可配有度数，天天佩戴，应每日清洗镜架及镜片！不用时应先清洁再收纳！'} productPrice={564.99} onDelete={() => {}} />

          {video.videoUrl && <Units type='video' src={video.videoUrl} />}

        </View>

        {/* 工具栏区域、include各种插件触发图标、发布等 */}
        <View className={styles['toolbar']}>
          <View className={styles['tag-toolbar']}>
            <Tag content='随机红包\总金额80元\20个' />
            <Tag
              content={this.rewardContent()}
              clickCb={this.toSelectReward}
            />
          </View>
          <PlusinToolbar
            clickCb={(item) => {
              this.handlePlusinClick(item);
            }}
            onCategoryClick={() => this.setState({ showClassifyPopup: true })}
          />
          <DefaultToolbar clickCb={(item) => {
            this.handlePlusinClick(item);
          }} />


          {/* 二级分类弹框 */}
          <ClassifyPopup
            show={showClassifyPopup}
            category={categories}
            onHide={() => this.setState({ showClassifyPopup: false })}
            onChange={this.onClassifyChange}
          />
        </View>
      </ThemePage >
    );
  }
}

export default Index;
