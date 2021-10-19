import React from 'react';
import { observer, inject } from 'mobx-react';
import { View } from '@tarojs/components';
import Icon from '@discuzq/design/dist/components/icon/index';
import Badge from '@discuzq/design/dist/components/badge/index';
import styles from './index.module.scss';
import Router from '@discuzq/sdk/dist/router';
import UnreadRedDot from '@components/unread-red-dot';

@inject('user')
@inject('site')
@inject('message')
@observer
class UserCenterAction extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      actions: [
        {
          cid: 'message',
          name: '我的消息',
          url: '/subPages/message/index',
          iconName: 'MailOutlined',
          totalUnread: 9
        },
        {
          cid: 'wallet',
          name: '我的钱包',
          url: '/subPages/wallet/index',
          iconName: 'PayOutlined'

        },
        {
          cid: 'collect',
          name: '我的收藏',
          url: '/userPages/my/collect/index',
          iconName: 'CollectOutlinedBig'

        },
        {
          cid: 'block',
          name: '我的屏蔽',
          url: '/userPages/my/block/index',
          iconName: 'ShieldOutlined'

        },
        {
          cid: 'buy',
          name: '我的购买',
          url: '/userPages/my/buy/index',
          iconName: 'ShoppingCartOutlined'

        },
        {
          cid: 'draft',
          name: '我的草稿箱',
          url: '/userPages/my/draft/index',
          iconName: 'RetrieveOutlined'

        },
        {
          cid: 'forum',
          name: '站点信息',
          url: '/subPages/forum/index',
          iconName: 'NotepadOutlined'

        },
        {
          cid: 'invite',
          name: '推广邀请',
          url: '/subPages/invite/index',
          iconName: 'NotbookOutlined'

        },
        {
          cid: 'shopOutlined',
          name: '商城',
          url: '',
          iconName: 'ShopOutlined'

        }
      ],
      actionsView: [] // 用于页面渲染
    }
  }

  handleActionItem = (item) => {
    if (item.url) {
      Router.push({ url: item.url });
    }
  }

  componentDidMount() {
    this.props.message.readUnreadCount();
    const actions = this.state.actions.slice()
    const actionsView = [] 
    const platform = this.props.site.platform

    // 管理员 去除 推广邀请配置
    if (this.props.user.isAdmini) {
      const inviteIndex = this.state.actions.findIndex(item => item.cid === 'invite')
      inviteIndex > -1 && actions.splice(inviteIndex, 1)
    }

    const step = 4
    for (let i = 0; i < actions.length; i+=step) {
      if ((i + step) <= actions.length) {
        actionsView.push(actions.slice(i, i + step))
      } else {
        actionsView.push(actions.slice(i, actions.length))
      }
    }
   
    // 如果不止一行，最后一个数组补齐元素，用于页面渲染
    if (actions.length > step && actions.length % step) {
      const count = step - actions.length % step
      const lastRowActions =  actionsView[actionsView.length-1]
      for (let i = 0; i < count; i++) {
        lastRowActions.push({})
      }
    }

    this.setState({actionsView})
  }

  renderActionItem = (item, totalUnread) => {
    return (
      <View onClick={() => {this.handleActionItem(item)}} className={styles.userCenterActionItem}>
        <View className={styles.userCenterActionItemIcon}>
        {
          item.cid === 'message' ?
            <UnreadRedDot unreadCount={totalUnread}>
              <Icon name={item.iconName} color={'#4F5A70'} size={20} />
            </UnreadRedDot>
            :
            <Badge>
              <Icon name={item.iconName} color={'#4F5A70'} size={20} />
            </Badge>
        }
        </View>
        <View className={styles.userCenterActionItemDesc}>{item.name}</View>
      </View>
    )
  }

  renderExtraActionItem = () => {
    return (
      <View className={styles.userCenterActionItem}></View>
    )
  }
  
  

  render() {
    const { totalUnread } = this.props.message;
    const { actionsView } = this.state
    const { webConfig: { other: { threadOptimize } } } = this.props.site;
    return (
      <View className={styles.userCenterAction}>
        {
          actionsView.map(items => (
            <view className={styles.userCenterActionItemContainer}>
              {
                items.length && items.map(item => item.cid ? this.renderActionItem(item, totalUnread) : this.renderExtraActionItem()) 
              }
            </view>
            
          ))
        }
      </View>
    );
  }
}

export default UserCenterAction;
