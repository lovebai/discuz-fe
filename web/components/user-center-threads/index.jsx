import React from 'react';
import { inject, observer } from 'mobx-react';
import { computed } from 'mobx';
import { Icon, ActionSheet, Toast, Dropdown } from '@discuzq/design';
import { withRouter } from 'next/router';
import Thread from '@components/thread';
import styles from './index.module.scss';

const COMMON_ACTIONS = [
  {
    key: 'edit',
    icon: 'CompileOutlined',
    description: '编辑',
  },
  {
    key: 'delete',
    icon: 'DeleteOutlined',
    description: '删除',
  },
];

const TOP_ACTIONS = [
  {
    key: 'top',
    icon: 'TopOutlined',
    description: '置顶',
  },
  ...COMMON_ACTIONS,
];

const UNTOP_ACTIONS = [
  {
    key: 'untop',
    icon: 'TopOutlined',
    description: '取消置顶',
  },
  ...COMMON_ACTIONS,
];

const COMMON_MENUS = (
  <>
    <Dropdown.Item id="edit">
      <Icon name="CompileOutlined" />
      编辑
    </Dropdown.Item>
    <Dropdown.Item id="delete">
      <Icon name="DeleteOutlined" />
      删除
    </Dropdown.Item>
  </>
);

const TOP_MENUS = (
  <Dropdown.Menu>
    <Dropdown.Item id="top">
      <Icon name="TopOutlined" />
      置顶
    </Dropdown.Item>
    {COMMON_MENUS}
  </Dropdown.Menu>
);

const UNTOP_MENUS = (
  <Dropdown.Menu>
    <Dropdown.Item id="untop">取消置顶</Dropdown.Item>
    {COMMON_MENUS}
  </Dropdown.Menu>
);

@inject('index')
@inject('search')
@inject('thread')
@inject('site')
@inject('user')
class UserCenterThreads extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      actionSheetVisible: false,
      currentAction: TOP_ACTIONS,
      currentMenu: TOP_MENUS,
    };
  }

  activeThread = null;

  // 置顶处理函数
  topThreadHandler = () => {
    console.log('on top', this.activeThread);
  };

  // 取消置顶处理函数
  unTopThreadHandler = () => {
    console.log('on untop', this.activeThread);
  };

  // 编辑帖子处理函数
  editThreadHandler = () => {
    this.props.router.push(`/thread/post?id=${this.activeThread.threadId}`);
  };

  // 删除帖子处理函数
  deleteThreadHandler = async () => {
    const { thread } = this.props;
    this.toastInstance = Toast.loading({
      content: '删除中...',
      duration: 0,
    });
    const res = await thread.delete(this.activeThread.threadId, this.props.index);
    this.toastInstance?.destroy();
    if (res.code === 0) {
      Toast.success({ content: '删除帖子成功' });
    } else {
      Toast.error({ content: res.msg });
    }
  };

  actionSheetSelectHandler = (e, item) => {
    if (e && e.stopPropagation) {
      e.stopPropagation();
    }

    switch (item.key) {
      case 'top':
        this.topThreadHandler();
        break;
      case 'untop':
        this.unTopThreadHandler();
        break;
      case 'edit':
        this.editThreadHandler();
        break;
      case 'delete':
        this.deleteThreadHandler();
        break;
    }

    this.closeActionSheet();
  };

  onActionClick = (e) => {
    e.stopPropagation();
    this.setState({
      actionSheetVisible: true,
    });
  };

  closeActionSheet = () => {
    this.setState({
      actionSheetVisible: false,
    });
  };

  setTopActions = () => {
    this.setState({
      currentAction: TOP_ACTIONS,
      currentMenu: TOP_MENUS,
    });
  };

  setUnTopActions = () => {
    this.setState({
      currentAction: UNTOP_ACTIONS,
      currentMenu: UNTOP_MENUS,
    });
  };

  isOtherThreads = () => {
    const { query = {} } = this.props.router;

    return query.id;
  };

  renderExtraTag = (itemInfo) => {
    if (this.isOtherThreads()) {
      return null;
    }

    const spanElement = (
      <span
        onClick={(e) => {
          if (this.props.site.platform === 'pc') return;
          this.onActionClick(e);
          this.activeThread = itemInfo;
        }}
      >
        <Icon name="MoreBOutlined" />
      </span>
    );

    if (this.props.site.platform === 'pc') {
      return (
        <div onClick={e => e.stopPropagation()}>
          <Dropdown
            arrow={false}
            onVisibleChange={(isShow) => {
              if (isShow) {
                this.activeThread = itemInfo;
              }
            }}
            onChange={(key) => {
              this.actionSheetSelectHandler(null, { key });
            }}
            menu={this.state.currentMenu}
            trigger="hover"
          >
            {spanElement}
          </Dropdown>
        </div>
      );
    }

    return spanElement;
  };

  renderActionSheet = () => {
    if (this.isOtherThreads()) {
      return null;
    }

    return (
      <ActionSheet
        visible={this.state.actionSheetVisible}
        layout="row"
        actions={TOP_ACTIONS}
        onSelect={this.actionSheetSelectHandler}
        onClose={this.closeActionSheet}
      />
    );
  };

  render() {
    return (
      <div className={styles.threadsContainer}>
        {this.props.data.map((itemInfo, index, arr) => (
          <Thread
            key={`${itemInfo.threadId}-${itemInfo.updatedAt}-${itemInfo._time}`}
            data={itemInfo}
            showBottomStyle={index !== arr.length - 1}
            extraTag={this.renderExtraTag(itemInfo)}
            className={this.props.threadClassName || ''}
          />
        ))}
        {this.renderActionSheet()}
      </div>
    );
  }
}

export default withRouter(UserCenterThreads);
