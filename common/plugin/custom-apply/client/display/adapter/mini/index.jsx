import React from 'react';
import { View, Text } from '@tarojs/components';
import { Button, Icon, Avatar } from '@discuzq/design';
import PopupList from '@components/thread/popup-list';
import classNames from 'classnames';
import styles from '../index.module.scss';

export default class CustomApplyDisplay extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      imgs: [
        {
          url: '',
          name: 'A',
        },
        {
          url: '',
          name: 'b',
        },
        {
          url: '',
          name: 'dd',
        },
        {
          url: '',
          name: 'dd',
        },
      ],
      popupShow: false,
    };
  }

  getUserCls = () => {
    if (this.state.imgs.length >= 3) return styles.three;
    if (this.state.imgs.length === 2) return styles.two;
    if (this.state.imgs.length === 1) return styles.one;
  };

  render() {
    const { siteData } = this.props;
    const { popupShow } = this.state;
    const platform = siteData.platform === 'h5' ? styles.h5 : styles.pc;
    return (
      <>
        <View className={classNames(styles.wrapper, platform)}>
          <View className={styles['wrapper-header']}>
            <View className={styles['wrapper-header__left']}>
              我是报名帖标题哈哈哈哈哈哈哈哈哈哈哈哈啊哈哈哈哈
            </View>
            <View className={styles['wrapper-header__right']}>
              还有<Text className={styles['text-primary']}>14</Text>分<Text className={styles['text-primary']}>13</Text>秒结束报名
            </View>
          </View>
          <View className={styles['wrapper-content']}>
            <View className={styles['wrapper-content__detail']}>
              活动详情活动内容活动内容活动内容活动内容活动内容活动详情活动内容活动内容活动内容活动内容活动内容活动详情活动内容活动内容活动内容活动内容活动内容活动详情活动内容活动内容
            </View>
            <View className={classNames(styles['text-primary'], styles.more)}>查看详情 ></View>
            <View className={styles['wrapper-content__tip']}>
              <Icon name="TimeOutlined" />
              <View className={styles['wrapper-tip__content']}>
                <Text className={styles['wrapper-tip_title']}>活动时间</Text>
                <Text className={styles['wrapper-tip_detail']}>2021/08/18 19：00 ~ 2021/08/19 19：00</Text>
              </View>
            </View>
            <View className={styles['wrapper-content__tip']}>
              <Icon name="PositionOutlined" />
              <View className={styles['wrapper-tip__content']}>
                <Text className={styles['wrapper-tip_title']}>活动地址</Text>
                <Text className={styles['wrapper-tip_detail']}>深圳市南山区人才公园</Text>
              </View>
            </View>
            <View className={styles['wrapper-content__limit']}>
              限<Text className={styles['text-primary']}>14</Text>人参与
            </View>
          </View>
          <View className={styles['wrapper-footer']}>
            <View className={styles['wrapper-footer__top']}>
              <View
                className={classNames(styles.users, this.getUserCls())}
                onClick={() => this.setState({ popupShow: true })}
              >
                {this.state.imgs.map((item, index) => {
                  if (index <= 2) return <Avatar circle={true} size="small" text={item.name} image={item.url} key="index" />;
                  return null;
                })}
                <Text className={styles.m10}>{this.state.imgs.length}人已报名</Text>
              </View>
              <Button type="primary">立即报名</Button>
            </View>
            <Button full disabled className={styles.donebtn}>人数已满</Button>
          </View>
        </View>
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
