import React from 'react';
import styles from './index.module.scss';
import Icon from '@discuzq/design/dist/components/icon/index';
import { noop } from '@components/thread/utils';
import { View } from '@tarojs/components';
import Taro from '@tarojs/taro'
import { inject, observer } from 'mobx-react';
import Router from '@discuzq/sdk/dist/router';
import UnreadRedDot from '@components/unread-red-dot';


/**
 * BottomNavBar组件
 * @prop {boolean} placeholder 固定在底部时，是否在标签位置生成一个等高的占位元素
 * @prop {boolean} curr 常亮icon
 */

const routes = [
  'pages/index/index',
  'subPages/search/index',
  'subPages/thread/post/index',
  'subPages/message/index',
  'subPages/my/index'
]

@inject('index')
@inject('user')
@inject('message')
@observer
class BottomNavBar extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      tabs: []
    }
    this.timeoutRef = React.createRef();
  }

  componentDidMount() {
    const { curr = 'home' } = this.props
    const tabs = [
      { icon: 'HomeOutlined', text: '首页', active: this.checkCurrActiveTab(curr, 'home'), router: '/pages/index/index' },
      { icon: 'FindOutlined', text: '发现', active: this.checkCurrActiveTab(curr, 'search'), router: '/subPages/search/index' },
      { icon: 'PlusOutlined', router: '/subPages/thread/post/index' },
      { icon: 'MailOutlined', text: '消息', active: this.checkCurrActiveTab(curr, 'message'), router: '/subPages/message/index' },
      { icon: 'ProfessionOutlined', text: '我的', active: this.checkCurrActiveTab(curr, 'my'), router: '/subPages/my/index' },
    ]

    this.setState({ tabs })

    this.props.message.readUnreadCount();
    this.updateUnreadMessage();
  }

  componentWillUnmount() {
    clearTimeout(this.timeoutRef.current);
  }

  checkCurrActiveTab = (curr, target) => {
    return curr === target;
  }

  handleClick = (i, idx) => {
    if (i.router === '/subPages/thread/post/index') {
      const { permissions } = this.props.user;
      if (permissions && permissions.createThread && !permissions.createThread.enable) {
        Taro.showToast({ title: '您暂无发帖权限', icon: 'none' });
        return;
      }
    }

    const { onClick = noop } = this.props
    const { tabs } = this.state

    onClick(i, idx)
    const temp = [...tabs];
    if (i.text) {
      // temp.find(i => i.active).active = false;
      // temp[idx].active = true;
      this.setState({ tabs: temp })
    }

    const current = Taro.getCurrentPages()
    let routeIndex = -1
    current?.forEach((item, index) => {
      if (`/${item.route}` === i.router) {
        routeIndex = index
      }
    })
    if (routeIndex === -1) {
      Router.push({url: i.router});
    } else {
      const num = current.length - 1 - routeIndex
      if (current?.length !== 1 && routeIndex !== current.length - 1 && num >= 0) {
        Taro.navigateBack({delta: current.length - 1 - routeIndex});
      }
    }
    //
  };

  // 每20秒更新一次未读消息
  updateUnreadMessage = () => {
    this.timeoutRef.current = setTimeout(() => {
      this.props.message.readUnreadCount();
      this.updateUnreadMessage();
    }, 20000);
  }

  render() {
    const { fixed = true, placeholder = false, } = this.props
    const { totalUnread } = this.props.message
    const { hiddenTabBar } = this.props.index
    const { tabs } = this.state

    return (
      <>
      <View className={styles.footer} style={{ position: fixed ? 'fixed' : '', zIndex: `${hiddenTabBar ? '-1' : '1000'}` }}>
        {tabs.map((i, idx) => (i.text ? (
            <View key={idx} className={styles.item + (i.active ? ` ${styles.active}` : '')} onClick={() => this.handleClick(i, idx)}>
              {
                i.icon === 'MailOutlined' ? (
                  <UnreadRedDot unreadCount={totalUnread}>
                    <Icon name={i.icon} size={22} />
                  </UnreadRedDot>
                ) : (
                  <Icon name={i.icon} size={20} />
                )
              }
              <View className={styles.text}>{i.text}</View>
            </View>
        ) : (
            <View key={idx} style={{ flex: 1, textAlign: 'center' }} onClick={() => this.handleClick(i, idx)}>
              <View className={styles.addIcon}>
                <Icon name={i.icon} size={28} color="#fff" />
              </View>
            </View>
        )))}
      </View>
      {
        fixed && placeholder && (
          <View className={styles.placeholder} style={{ display: `${hiddenTabBar ? 'none' : 'block'}` }}>
            <View className={styles.addIcon}></View>
          </View>
        )
      }
      </>
    );
  }
};

export default BottomNavBar;
