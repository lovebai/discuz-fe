import React from 'react';
import { Button, Icon, Avatar } from '@discuzq/design';
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
    };
  }

  getUserCls = () => {
    if (this.state.imgs.length >= 3) return styles.three;
    if (this.state.imgs.length === 2) return styles.two;
    if (this.state.imgs.length === 1) return styles.one;
  };

  render() {
    const { siteData } = this.props;
    const platform = siteData.platform === 'h5' ? styles.h5 : styles.pc;
    return (
      <div className={classNames(styles.wrapper, platform)}>
        <div className={styles['wrapper-header']}>
          <div className={styles['wrapper-header__left']}>
            我是报名帖标题哈哈哈哈哈哈哈哈哈哈哈哈啊哈哈哈哈
          </div>
          <div className={styles['wrapper-header__right']}>
            还有<span className={styles['text-primary']}>14</span>分<span className={styles['text-primary']}>13</span>秒结束报名
          </div>
        </div>
        <div className={styles['wrapper-content']}>
          <div className={styles['wrapper-content__detail']}>
            活动详情活动内容活动内容活动内容活动内容活动内容活动详情活动内容活动内容活动内容活动内容活动内容活动详情活动内容活动内容活动内容活动内容活动内容活动详情活动内容活动内容
          </div>
          <div className={classNames(styles['text-primary'], styles.more)}>查看详情 ></div>
          <div className={styles['wrapper-content__tip']}>
            <Icon name="VoteOutlined" />
            <div className={styles['wrapper-tip__content']}>
              <span className={styles['wrapper-tip_title']}>活动时间</span>
              <span className={styles['wrapper-tip_detail']}>2021/08/18 19：00 ~ 2021/08/19 19：00</span>
            </div>
          </div>
          <div className={styles['wrapper-content__tip']}>
            <Icon name="VoteOutlined" />
            <div className={styles['wrapper-tip__content']}>
              <span className={styles['wrapper-tip_title']}>活动地址</span>
              <span className={styles['wrapper-tip_detail']}>深圳市南山区人才公园</span>
            </div>
          </div>
          <div className={styles['wrapper-content__limit']}>
            限<span className={styles['text-primary']}>14</span>人参与
          </div>
        </div>
        <div className={styles['wrapper-footer']}>
          <div className={styles['wrapper-footer__top']}>
            <div className={classNames(styles.users, this.getUserCls())}>
              {this.state.imgs.map((item, index) => {
                if (index <= 2) return <Avatar circle={true} size="small" text={item.name} image={item.url} key="index" />;
                return null;
              })}
              <span className={styles.m10}>{this.state.imgs.length}人已报名</span>
            </div>
            <Button type="primary">立即报名</Button>
          </div>
          <Button full disabled className={styles.donebtn}>人数已满</Button>
        </div>
      </div>
    );
  }
};
