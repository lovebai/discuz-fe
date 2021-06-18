import React from 'react';
import styles from './index.module.scss';
import Avatar from '@components/avatar';
import { View, Text } from '@tarojs/components';
import { diffDate } from '@common/utils/diff-date';
import { observer } from 'mobx-react';
import s9e from '@common/utils/s9e';
import xss from '@common/utils/xss';
import classNames from 'classnames';
import ImageDisplay from '@components/thread/image-display';
import RichText from '@discuzq/design/dist/components/rich-text/index';
import { handleLink } from '@components/thread/utils';
import Router from '@discuzq/sdk/dist/router';
import { debounce } from '@common/utils/throttle-debounce';

@observer
export default class ReplyList extends React.Component {
  // 跳转至评论详情
  toCommentDetail() {
    console.log('跳至评论详情');
  }

  likeClick() {
    typeof this.props.likeClick === 'function' && this.props.likeClick();
  }
  replyClick() {
    typeof this.props.replyClick === 'function' && this.props.replyClick();
  }
  deleteClick() {
    typeof this.props.likeClick === 'function' && this.props.deleteClick();
  }

  avatarClick(floor) {
    typeof this.props.avatarClick === 'function' && this.props.avatarClick(floor);
  }

  generatePermissions(data = {}) {
    return {
      canApprove: data.canApprove || false,
      canDelete: data.canDelete || false,
      canEdit: data.canEdit || false,
      canHide: data.canHide || false,
      canLike: data.canLike || false,
    };
  }

  filterContent() {
    let newContent = this.props?.data?.content || '';
    newContent = s9e.parse(newContent);
    newContent = xss(newContent);

    return newContent;
  }

  handleClick(e, node) {
    e && e.stopPropagation();
    const { url, isExternaLink } = handleLink(node);
    if (isExternaLink) return;

    if (url) {
      Router.push({ url });
    } else {
      this.toCommentDetail();
    }
  }

  render() {
    const { canLike, canDelete, canHide } = this.generatePermissions(this.props.data);

    return (
      <View className={styles.replyList}>
        <View className={styles.replyListAvatar} onClick={() => {this.avatarClick(2)}}>
          <Avatar
            image={this.props?.data?.user?.avatar}
            name={this.props?.data?.user?.nickname || this?.props?.data?.user?.userName || ''}
            circle={true}
            size="small"
          ></Avatar>
        </View>
        <View className={styles.replyListContent}>
          <View className={styles.replyListContentText}>
            <View className={styles.replyListName} onClick={() => {this.avatarClick(2)}}>
              {this.props.data?.user?.nickname || this.props.data?.user?.userName || '用户异常'}
            </View>
            <View className={styles.replyListText}>
              {/* 二级回复用户 */}
              {this.props.data.commentUserId && this.props?.data?.commentUser ? (
                <View className={styles.commentUser}>
                  <View className={styles.replyedAvatar} onClick={() => {this.avatarClick(3)}}>
                    <Avatar
                      className={styles.avatar}
                      image={this.props.data.commentUser.avatar}
                      name={this.props.data.commentUser.nickname || this.props.data.commentUser.userName || ''}
                      circle={true}
                      size="small"
                    ></Avatar>
                  </View>
                  <Text className={styles.replyedUserName} onClick={() => {this.avatarClick(3)}}>
                    {this.props.data.commentUser.nickname || this.props.data.commentUser.userName}
                  </Text>
                </View>
              ) : (
                ''
              )}
              {/* 回复内容 */}
              <RichText
                className={classNames(styles.content, this.props.isShowOne && styles.isShowOne)}
                content={this.filterContent()}
                onClick={this.handleClick.bind(this)}
              />

              {/* 图片展示 */}
              {this.props.data?.images || this.props.data?.attachments ? (
                <View className={styles.imageDisplay}>
                  <ImageDisplay platform="h5" imgData={this.props.data.images || this.props.data.attachments} />
                </View>
              ) : (
                ''
              )}
            </View>
          </View>

          <View className={styles.replyListFooter}>
            <View className={styles.replyTime}>{diffDate(this.props.data.createdAt)}</View>
            {this.props?.data?.user && (
              <View className={styles.extraBottom}>
                <View className={this.props?.data?.isLiked ? styles.replyLike : styles.replyLiked}>
                  <Text onClick={debounce(() => this.likeClick(canLike), 500)}>
                    赞&nbsp;{this.props?.data?.likeCount === 0 ? '' : this.props.data.likeCount}
                  </Text>
                </View>
                <View className={styles.replyReply}>
                  <Text onClick={() => this.replyClick()}>回复</Text>
                </View>
                {canHide && (
                  <View className={styles.replyReply}>
                    <Text onClick={debounce(() => this.deleteClick(), 500)}>删除</Text>
                  </View>
                )}

                {/*                <View className={styles.replyReply}>
                   {canEdit && <View className={styles.revise} onClick={() => this.editClick()}>编辑</View>}
                  {canDelete && (
                    <View  onClick={() => this.replyDeleteClick()}>
                      {canDelete}
                    </View>
                  )}
                </View>*/}
              </View>
            )}
          </View>
        </View>
      </View>
    );
  }
}
