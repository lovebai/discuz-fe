import React from 'react';
import { View, Text } from '@tarojs/components';
import { Icon, Dialog, Toast } from '@discuzq/design';
import CustomApplyEntryContent from './content';
import { getPostData } from '@common/plugin/custom-apply/client/common';
import classNames from 'classnames';
import styles from '../index.module.scss';

export default class CustomApplyEntry extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      body: {},
    };
  }

  change = (body) => {
    this.setState({ body });
  };

  handleDialogOpen = () => {
    const { postData } = this.props;
    const { navInfo = {} } = postData.threadPost || {};
    const navStyle = {
      marginTop: `${navInfo.statusBarHeight}px`,
      height: `${navInfo.navHeight}px`,
    };
    Dialog.confirm({
      isNew: true,
      className: classNames(styles['dzqp-act'], styles.h5, styles.mini),
      headerStyle: navStyle,
      title: '创建活动报名',
      content: <CustomApplyEntryContent {...this.props} onChange={this.change} />,
      onConfirm: this.handleDialogConfirm,
    });
  };

  getTimestamp = time => new Date(time).getTime();

  handleDialogConfirm = () => {
    const { body } = this.state;
    if (!body.activityStartTime || !body.activityEndTime) {
      Toast.info({ content: '活动开始时间和结束时间必填' });
      return false;
    }
    if (this.getTimestamp(body.activityEndTime) <= this.getTimestamp(new Date())) {
      Toast.info({ content: '活动结束时间必须大于当前时间' });
      return false;
    }
    const { renderData, _pluginInfo } = this.props;
    const postData = getPostData(body, _pluginInfo.options.tomId) || {};
    if (renderData?.body?.activityId) postData.body.activityId = renderData?.body?.activityId;
    this.props.onConfirm({ postData });
    Dialog.hide();
  };

  isShowApplyIcon = () => {
    const { siteData, _pluginInfo } = this.props;
    const { pluginConfig } = siteData;
    if (!pluginConfig) return false;
    const [act] = (pluginConfig || []).filter(item => item.app_id === _pluginInfo.options.tomId);
    if (act?.authority?.canUsePlugin) return true;
    return false;
  };

  render() {
    if (!this.isShowApplyIcon()) return null;
    return (
      <>
        <Icon
          onClick={this.handleDialogOpen}
          name="ApplyOutlined"
          size="20"
        />
      </>
    );
  }
}
