import React from 'react';
import { View, Text } from '@tarojs/components';
import { Icon, Dialog, Button, Input, Textarea, Radio, Toast } from '@discuzq/design';
import DatePickers from '@components/thread-post/date-time-picker';
import classNames from 'classnames';
import { formatDate } from '@common/utils/format-date';
import styles from '../index.module.scss';

const TimeType = {
  actStart: 'actStartTime',
  actEnd: 'actEndTime',
  applyStart: 'actApplyStartTime',
  applyEnd: 'actApplyEndTime',
};
export default class CustomApplyEntryContent extends React.Component {
  constructor(props) {
    super(props);
    const oneHour = 3600 * 1000 * 24;

    this.state = {
      showMore: false,
      showMobileDatePicker: false,
      body: {
        actStartTime: new Date(), // 活动开始时间
        actEndTime: new Date().getTime() + oneHour, // 活动结束时间
        actName: '', // 活动名称
        actDetail: '', // 活动详情
        actApplyStartTime: '', // 报名开始时间
        actApplyEndTime: '', // 报名结束时间
        actPlace: '', // 活动地点
        actPeopleLimitType: 0, // 0 不限制；1 限制
        actPeopleLimitNum: '',
      },
      curClickTime: TimeType.actStart,
    };

    this.timeRef = React.createRef();
  }

  handleTimeChange = (date, type) => {
    const { body } = this.state;
    const time = date;
    switch (type) {
      case TimeType.actStart:
        this.setState({ body: { ...body, actStartTime: time } }, () => {
          this.props.onChange(this.state.body);
        });
        break;
      case TimeType.actEnd:
        this.setState({ body: { ...body, actEndTime: time } }, () => {
          this.props.onChange(this.state.body);
        });
        break;
      case TimeType.applyStart:
        if (!this.checkApplyStartTime(time)) {
          Toast.info({ content: '请选择正确的活动报名开始时间' });
        } else {
          this.setState({ body: { ...body, actApplyStartTime: time } }, () => {
            this.props.onChange(this.state.body);
          });
        }
        break;
      case TimeType.applyEnd:
        if (!this.checkApplyEndTime(time)) {
          Toast.info({ content: '请选择正确的活动报名结束时间' });
        } else {
          this.setState({ body: { ...body, actApplyEndTime: time } }, () => {
            this.props.onChange(this.state.body);
          });
        }
        break;
      default:
        break;
    }
  };

  getTimestamp = time => new Date(time).getTime();

  checkApplyStartTime = (time) => {
    const { body } = this.state;
    const { actStartTime, actEndTime, actApplyEndTime } = body || {};
    if (this.getTimestamp(time) < this.getTimestamp(actStartTime)
      || this.getTimestamp(time) > this.getTimestamp(actEndTime)
      || (actApplyEndTime && this.getTimestamp(time) > this.getTimestamp(actApplyEndTime))) {
      return false;
    }
    return true;
  };

  checkApplyEndTime = (time) => {
    const { body } = this.state;
    const { actStartTime, actApplyStartTime, actEndTime } = body || {};
    if (this.getTimestamp(time) < this.getTimestamp(actStartTime)
      || this.getTimestamp(time) > this.getTimestamp(actEndTime)
      || (actApplyStartTime && this.getTimestamp(time) < this.getTimestamp(actApplyStartTime))) {
      return false;
    }
    return true;
  };

  handleActNameChange = (e) => {
    const { body } = this.state;
    this.setState({ body: { ...body, actName: e.target.value } }, () => {
      this.props.onChange(this.state.body);
    });
  };

  handleActDetailChange = (e) => {
    const { body } = this.state;
    this.setState({ body: { ...body, actDetail: e.target.value } }, () => {
      this.props.onChange(this.state.body);
    });
  }

  handlePlaceChange = (e) => {
    const { body } = this.state;
    this.setState({ body: { ...body, actPlace: e.target.value } }, () => {
      this.props.onChange(this.state.body);
    });
  }

  handleMoreClick = () => {
    this.setState({ showMore: !this.state.showMore });
  };

  handleLimitChange = (val) => {
    const { body } = this.state;
    this.setState({ body: { ...body, actPeopleLimitType: val } }, () => {
      this.props.onChange(this.state.body);
    });
  };

  handleLimitPeopleChange = (e) => {
    const { body } = this.state;
    this.setState({ body: { ...body, actPeopleLimitNum: e.target.value } }, () => {
      this.props.onChange(this.state.body);
    });
  };

  handleTimeClick = (curClickTime) => {
    this.setState({ showMobileDatePicker: true, curClickTime });
    const { openModal } = this.timeRef.current;
    openModal(this.state.times);
  };

  handleMobileTimeChange = (time) => {
    const { curClickTime } = this.state;
    this.handleTimeChange(new Date(time), curClickTime);
    this.setState({ showMobileDatePicker: false });
  };

  getMobileCurClickTime = () => {
    const { curClickTime, body } = this.state;
    const time = body[curClickTime];
    if (body[curClickTime]) return new Date(time);
    return new Date();
  };

  render() {
    const { showMore, body } = this.state;
    const moreClass = !showMore
      ? classNames(styles['dzqp-act--more'], styles.fold) : classNames(styles['dzqp-act--more'], styles.expand);
    return (
      <>
        <View className={styles['dzqp-act--item']}>
          <View className={styles['dzqp-act--item_title']}>开始时间</View>
          <View className={styles['dzqp-act--item_right']} onClick={() => this.handleTimeClick(TimeType.actStart)}>
            <Text>{formatDate(body.actStartTime, 'yyyy/MM/dd hh:mm:ss')}</Text>
            <Icon name="RightOutlined" size="8" />
          </View>
        </View>
        <View className={styles['dzqp-act--item']}>
          <View className={styles['dzqp-act--item_title']}>结束时间</View>
          <View className={styles['dzqp-act--item_right']} onClick={() => this.handleTimeClick(TimeType.actEnd)}>
            <Text>{formatDate(body.actEndTime, 'yyyy/MM/dd hh:mm:ss')}</Text>
            <Icon name="RightOutlined" size="8" />
          </View>
        </View>
        <View className={moreClass} onClick={this.handleMoreClick}>
          <Text>高级设置</Text>
          <Icon name="RightOutlined" size="8" />
        </View>
        {showMore && (
          <>
            <View className={classNames(styles['dzqp-act--item'], styles['act-name'])}>
              <View className={styles['dzqp-act--item_title']}>活动名称</View>
              <Input
                className={styles['dzqp-act--item_right']}
                htmlType="text"
                mode="text"
                placeholder="最多支持50个字符"
                maxLength={50}
                value={body.actName}
                onChange={this.handleActNameChange}
              />
            </View>
            <View className={classNames(styles['dzqp-act--item'], styles['act-detail'])}>
              <View className={classNames(styles['dzqp-act--item_title'], styles['width-auto'])}>
                活动详情 <Text>最多支持200个字符</Text>
              </View>
              <Textarea
                className={styles['dzqp-act--item_right']}
                placeholder="请输入活动介绍"
                rows={4}
                maxLength={200}
                value={body.actDetail}
                onChange={this.handleActDetailChange}
              />
            </View>
            <View className={styles['dzqp-act--item']}>
              <View className={styles['dzqp-act--item_title']}>报名开始</View>
              <View className={styles['dzqp-act--item_right']} onClick={() => this.handleTimeClick(TimeType.applyStart)}>
                <Text>{body.actApplyStartTime && formatDate(body.actApplyStartTime, 'yyyy/MM/dd hh:mm:ss')}</Text>
                <Icon name="RightOutlined" size="8" />
              </View>
            </View>
            <View className={styles['dzqp-act--item']}>
              <View className={styles['dzqp-act--item_title']}>报名结束</View>
              <View className={styles['dzqp-act--item_right']} onClick={() => this.handleTimeClick(TimeType.applyEnd)}>
                <Text>{body.actApplyEndTime && formatDate(body.actApplyEndTime, 'yyyy/MM/dd hh:mm:ss')}</Text>
                <Icon name="RightOutlined" size="8" />
              </View>
            </View>
            <View className={styles['dzqp-act--item']}>
              <View className={styles['dzqp-act--item_title']}>活动地点</View>
              <View className={styles['dzqp-act--item_right']}>
                <Input
                  className={styles['dzqp-act--item_right']}
                  htmlType="text"
                  mode="text"
                  placeholder="请输入活动地点"
                  maxLength={50}
                  value={body.actPlace}
                  onChange={this.handlePlaceChange}
                />
              </View>
            </View>
            <View className={styles['dzqp-act--item']}>
              <View className={styles['dzqp-act--item_title']}>人数限制</View>
              <View className={styles['dzqp-act--item_right']}>
                <Radio.Group
                  onChange={this.handleLimitChange}
                  value={body.actPeopleLimitType}
                >
                  <Radio name={0}>不限制</Radio>
                  <Radio name={1}>
                    限<Input htmlType="number" mode="number"
                      disabled={body.actPeopleLimitType === 0}
                      value={body.actPeopleLimitNum}
                      onChange={this.handleLimitPeopleChange}
                    />人报名
                  </Radio>
                </Radio.Group>
              </View>
            </View>
          </>
        )}
        <DatePickers
          ref={this.timeRef}
          onConfirm={this.handleMobileTimeChange}
          initValue={this.getMobileCurClickTime()}
          wrap-class="my-class"
          select-item-class="mySelector"
        />
      </>
    );
  }
}
