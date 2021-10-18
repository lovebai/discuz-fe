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
          url: '/message',
          iconName: 'MailOutlined',
          totalUnread: 9
        },
        {
          cid: 'wallet',
          name: '我的钱包',
          url: '/wallet',
          iconName: 'PayOutlined'

        },
        {
          cid: 'collect',
          name: '我的收藏',
          url: '/my/collect',
          iconName: 'CollectOutlinedBig'

        },
        {
          cid: 'block',
          name: '我的屏蔽',
          url: '/my/block',
          iconName: 'ShieldOutlined'

        },
        {
          cid: 'buy',
          name: '我的购买',
          url: '/my/buy',
          iconName: 'ShoppingCartOutlined'

        },
        {
          cid: 'draft',
          name: '我的草稿箱',
          url: '/my/draft',
          iconName: 'RetrieveOutlined'

        },
        {
          cid: 'forum',
          name: '站点信息',
          url: '/forum',
          iconName: 'NotepadOutlined'

        },
        {
          cid: 'invite',
          name: '推广邀请',
          url: '/invite',
          iconName: 'NotbookOutlined'

        },
        {
          cid: 'shopOutlined',
          name: '商城',
          url: '',
          iconName: 'ShopOutlined'

        }
      ]
    }
  }
  
  componentDidMount() {
    this.props.message.readUnreadCount();
  }

  render() {
    const { totalUnread } = this.props.message;
    const { webConfig: { other: { threadOptimize } } } = this.props.site;
    return (
      <View className={styles.userCenterAction}>
        {
          this.state.actions.map((item, index) => (
            <View onClick={this.handleMyMessage} className={styles.userCenterActionItem}>
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
          ))
        }
      </View>

    );
  }
}

export default UserCenterAction;
