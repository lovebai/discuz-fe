/**
 * 创建帖子页面的 Store
 */
import { observable } from 'mobx';
import { LOADING_TOTAL_TYPE } from '@common/constants/thread-post';

class ThreadPostStore {
  /**
   * 表情列表
   */
  @observable emojis = [];
  /**
   * 商品信息
   */
  @observable product = {};
  /**
   * 推荐的话题列表，选择话题的时候需要
   */
  @observable topics = [];
  /**
   * 我的关注
   */
  @observable follows = [];
  /**
   * 加载状态
   */
  @observable loading = {
    [LOADING_TOTAL_TYPE.product]: false,
    [LOADING_TOTAL_TYPE.topic]: false,
    [LOADING_TOTAL_TYPE.emoji]: false,
    [LOADING_TOTAL_TYPE.follow]: false,
  };

  /**
   * 发帖相关数据
   */
  @observable postData = {
    title: '', // 标题
    categoryId: 0, // 分类id
    anonymous: 0, // 非匿名； 1 - 匿名。如果是 0 的时候不传
    draft: 0, // 非草稿：1 - 草稿。如果是 0 的时候不传
    price: 0, // 帖子价格 - 全贴付费。如果是 0 的时候不传
    attachmentPrice: 0, // 附件价格 - 帖子免费，附件收费。如果是 0 的时候不传
    freeWords: 1, // 百分比 0 - 1 之间；
    position: {}, // 定位信息。longtitude，latitude，address，location
    contentText: '', // 文本内容
    audio: {}, // 语音
    rewardQa: {}, // 悬赏问答
    product: {}, // 商品
    redpacket: {}, // 红包
    video: {}, // 视频
    images: {}, // 图片
    files: {}, // 文件
  }

  @observable
  categorySeleted = { // 选中的帖子类别
    parent: {}, // 选中的帖子父类
    child: {}, // 选中的帖子子类
  };
}

export default ThreadPostStore;