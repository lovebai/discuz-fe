import React from 'react';
import { inject, observer } from 'mobx-react';
import ImageContent from '@components/thread/image-content';
import AudioPlay from '@components/thread/audio-play';
import PostContent from '@components/thread/post-content';
import ProductItem from '@components/thread/product-item';
import VideoPlay from '@components/thread/video-play';
import PostRewardProgressBar, { POST_TYPE } from '@components/thread/post-reward-progress-bar';
import Tip from '@components/thread/tip';
import AttachmentView from '@components/thread/attachment-view';
import { Icon, Button, Divider, Dropdown, Tag } from '@discuzq/design';
import UserInfo from '@components/thread/user-info';
import classnames from 'classnames';
import topic from './index.module.scss';
import threadPay from '@common/pay-bussiness/thread-pay';
import { minus } from '@common/utils/calculate';

const typeMap = {
  101: 'IMAGE',
  102: 'VOICE',
  103: 'VIDEO',
  104: 'GOODS',
  105: 'QA',
  106: 'RED_PACKET',
  107: 'REWARD',
  108: 'VOTE',
  109: 'QUEUE',
  110: 'FILE',
  111: 'QA_IMAGE',
};

// 帖子内容
export default inject('user')(
  observer((props) => {
    const { store: threadStore } = props;
    const { text, indexes } = threadStore?.threadData?.content || {};
    const tipData = {
      postId: threadStore?.threadData?.postId,
      threadId: threadStore?.threadData?.threadId,
    };
    // 是否合法
    const isApproved = threadStore?.threadData?.isApproved || 0;
    // 是否加精
    const isEssence = threadStore?.threadData?.displayTag?.isEssence || false;
    // 是否置顶
    const isStick = threadStore?.threadData?.isStick;

    // 更多弹窗权限
    const canEdit = threadStore?.threadData?.ability?.canEdit;
    const canDelete = threadStore?.threadData?.ability?.canDelete;
    const canEssence = threadStore?.threadData?.ability?.canEssence;
    const canStick = threadStore?.threadData?.ability?.canStick;

    // 是否附件付费
    const isAttachmentPay = threadStore?.threadData?.payType === 2 && threadStore?.threadData?.paid === false;
    const attachmentPrice = threadStore?.threadData?.attachmentPrice || 0;
    // 是否帖子付费
    const isThreadPay = threadStore?.threadData?.payType === 1 && threadStore?.threadData?.paid === false;
    const threadPrice = threadStore?.threadData?.price || 0;
    // 是否作者自己
    const isSelf = props.user?.userInfo?.id && props.user?.userInfo?.id === threadStore?.threadData?.userId;

    // 是否悬赏帖
    const isRedPack = threadStore?.threadData?.displayTag?.isRedPack;
    // 是否红包帖
    const isReward = threadStore?.threadData?.displayTag?.isReward;
    // 是否可以打赏
    const canReward = props?.user?.isLogin() && !isRedPack && !isReward;

    const parseContent = {};
    if (indexes && Object.keys(indexes)) {
      Object.entries(indexes).forEach(([, value]) => {
        if (value) {
          const { tomId, body } = value;
          parseContent[typeMap[tomId]] = body;
        }
      });
    }

    const onContentClick = async () => {
      const thread = props.store.threadData;
      const { success } = await threadPay(thread, props.user?.userInfo);

      // 支付成功重新请求帖子数据
      if (success && threadStore?.threadData?.threadId) {
        threadStore.fetchThreadDetail(threadStore?.threadData?.threadId);
      }
    };

    const onLikeClick = () => {
      typeof props.onLikeClick === 'function' && props.onLikeClick();
    };

    const onCollectionClick = () => {
      typeof props.onCollectionClick === 'function' && props.onCollectionClick();
    };

    const onShareClick = () => {
      typeof props.onShareClick === 'function' && props.onShareClick();
    };

    const onBuyClick = (url) => {
      url && window.open(url);
    };

    const onDropdownChange = (key) => {
      typeof props.onOperClick === 'function' && props.onOperClick(key);
    };

    const onRewardClick = () => {
      typeof props.onRewardClick === 'function' && props.onRewardClick();
    };

    return (
      <div className={`${topic.container}`}>
        <div className={topic.header}>
          <div className={topic.userInfo}>
            <UserInfo
              name={threadStore?.threadData?.user?.userName || ''}
              avatar={threadStore?.threadData?.user?.avatar || ''}
              location={threadStore?.threadData?.position.location || ''}
              view={`${threadStore?.threadData?.viewCount}` || ''}
              time={`${threadStore?.threadData?.createdAt}` || ''}
              userId={threadStore?.threadData?.user?.userId}
            ></UserInfo>
          </div>
          {props?.user?.isLogin() && (
            <div className={topic.more}>
              <div className={topic.iconText}>
                <Dropdown
                  menu={
                    <Dropdown.Menu>
                      {canEdit && <Dropdown.Item id="edit">编辑</Dropdown.Item>}
                      {canStick && <Dropdown.Item id="stick">{isStick ? '取消置顶' : '置顶'}</Dropdown.Item>}
                      {canEssence && <Dropdown.Item id="essence"> {isEssence ? '取消精华' : '精华'}</Dropdown.Item>}
                      {canDelete && <Dropdown.Item id="delete">删除</Dropdown.Item>}
                    </Dropdown.Menu>
                  }
                  placement="center"
                  hideOnClick={true}
                  arrow={false}
                  trigger="hover"
                  onChange={(key) => onDropdownChange(key)}
                >
                  <Icon className={topic.icon} name="SettingOutlined"></Icon>
                  <span className={topic.text}>管理</span>
                </Dropdown>
              </div>
              <div className={topic.iconText} onClick={() => onDropdownChange('report')}>
                <Icon className={topic.icon} name="WarnOutlinedThick"></Icon>
                <span className={topic.text}>举报</span>
              </div>
            </div>
          )}
          {isEssence && (
            <div className={topic.headerTag}>
              <Tag type="primary">精华</Tag>
            </div>
          )}
        </div>

        <Divider></Divider>

        {isApproved === 1 && (
          <div className={topic.body}>
            {/* 文字 */}
            {text && <PostContent useShowMore={false} content={text || ''} />}

            {/* 付费附件 */}
            {isAttachmentPay && !isSelf && (
              <div style={{ textAlign: 'center' }} onClick={onContentClick}>
                <Button className={topic.payButton} type="primary" size="large">
                  <div className={topic.pay}>
                    <Icon className={topic.payIcon} name="DollarLOutlined" size={18}></Icon>
                    支付{attachmentPrice}元查看附件
                  </div>
                </Button>
              </div>
            )}

            {/* 视频 */}
            {parseContent.VIDEO && (
              <VideoPlay
                url={parseContent.VIDEO.mediaUrl}
                coverUrl={parseContent.VIDEO.coverUrl}
                width={400}
                height={200}
              />
            )}
            {/* 图片 */}
            {parseContent.IMAGE && <ImageContent imgData={parseContent.IMAGE} />}
            {/* 商品 */}
            {parseContent.GOODS && (
              <div className={topic.goods}>
                <ProductItem
                  image={parseContent.GOODS.imagePath}
                  amount={parseContent.GOODS.price}
                  title={parseContent.GOODS.title}
                />
                <Button
                  className={topic.buyBtn}
                  type="danger"
                  onClick={() => onBuyClick(parseContent.GOODS.detailContent)}
                >
                  购买商品
                </Button>
              </div>
            )}
            {/* 音频 */}
            {parseContent.VOICE && <AudioPlay url={parseContent.VOICE.mediaUrl} />}
            {/* 附件 */}
            {parseContent.VOTE && <AttachmentView attachments={parseContent.VOTE} />}

            {/* 标签 */}
            {threadStore?.threadData?.categoryName && (
              <div className={topic.tag}>{threadStore?.threadData?.categoryName}</div>
            )}

            {(parseContent.RED_PACKET || parseContent.REWARD) && (
              <div className={topic.reward}>
                {/* 红包 */}
                {parseContent.RED_PACKET && (
                  <PostRewardProgressBar
                    remaining={Number(parseContent.RED_PACKET.remain_number || 0)}
                    received={
                      Number(parseContent.RED_PACKET.number || 0) - Number(parseContent.RED_PACKET.remain_number || 0)
                    }
                  />
                )}
                {/* 悬赏 */}
                {parseContent.REWARD && (
                  <div className={topic.rewardBody}>
                    <PostRewardProgressBar
                      type={POST_TYPE.BOUNTY}
                      remaining={Number(parseContent.REWARD.remain_money || 0)}
                      received={minus(
                        Number(parseContent.REWARD.money || 0),
                        Number(parseContent.REWARD.remain_money || 0),
                      )}
                    />
                    <div className={topic.rewardMoney}>
                      本帖向所有人悬赏<span className={topic.rewardNumber}>{parseContent.REWARD.remain_money || 0}</span>元
                    </div>
                    <div className={topic.rewardTime}>{parseContent.REWARD.expired_at}截止悬赏</div>
                  </div>
                )}
              </div>
            )}

            {/* 帖子付费 */}
            {isThreadPay && !isSelf && (
              <div style={{ textAlign: 'center' }} onClick={onContentClick}>
                <Button className={topic.payButton} type="primary" size="large">
                  <div className={topic.pay}>
                    <Icon className={topic.payIcon} name="DollarLOutlined" size={18}></Icon>
                    支付{threadPrice}元查看剩余内容
                  </div>
                </Button>
              </div>
            )}

            {/* 打赏 */}
            {canReward && (
              <Button onClick={onRewardClick} className={topic.rewardButton} type="primary" size="large">
                <div className={topic.buttonIconText}>
                  <Icon className={topic.buttonIcon} name="HeartOutlined"></Icon>
                  <span className={topic.buttonText}>打赏</span>
                </div>
              </Button>
            )}
          </div>
        )}

        {/* 点赞分享 */}
        <div className={topic.footer}>
          <div className={topic.thumbs}>
            <div className={topic.likeReward}>
              <Tip tipData={tipData} imgs={threadStore?.threadData?.likeReward?.users || []}></Tip>
            </div>
            <span>{threadStore?.threadData?.likeReward?.likePayCount || ''}</span>
          </div>
          {threadStore?.threadData?.likeReward?.shareCount > 0 && (
            <span className={topic.share}>{threadStore?.threadData?.likeReward?.shareCount}次分享</span>
          )}
        </div>

        <Divider className={topic.divider}></Divider>

        {/* 操作按钮 */}
        <div className={topic.bottomOperate}>
          <div
            className={classnames(topic.item, threadStore?.threadData?.isLike && topic.active)}
            onClick={onLikeClick}
          >
            <Icon name="LikeOutlined"></Icon>
            <span>{threadStore?.threadData?.isLike ? '取消' : '赞'}</span>
          </div>
          <div
            className={classnames(topic.item, threadStore?.threadData?.isFavorite && topic.active)}
            onClick={onCollectionClick}
          >
            <Icon name="CollectOutlined"></Icon>
            <span>{threadStore?.threadData?.isFavorite ? '取消' : '收藏'}</span>
          </div>
          <div className={classnames(topic.item)} onClick={onShareClick}>
            <Icon name="ShareAltOutlined"></Icon>
            <span>分享</span>
          </div>
        </div>
      </div>
    );
  }),
);