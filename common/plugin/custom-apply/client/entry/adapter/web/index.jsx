import React from 'react';
import { Icon, Dialog, Button, Input, Textarea, Radio, Toast } from '@discuzq/design';
// 移动端时间选择
import DatePickers from '@components/thread/date-picker';
// pc 端时间选择
import DatePicker from 'react-datepicker';
import classNames from 'classnames';
import { formatDate } from '@common/utils/format-date';
import styles from '../index.module.scss';

const TimeType = {
  actStart: 'actStart',
  actEnd: 'actEnd',
  applyStart: 'applyStart',
  applyEnd: 'applyEnd',
};
export default class CustomApplyEntry extends React.Component {
  constructor(props) {
    super(props);
    const oneHour = 3600 * 1000;

    this.state = {
      visible: true,
      showMore: true,
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
    };
  }

  handleTimeChange = (date, type) => {
    const { body } = this.state;
    const time = date;
    switch (type) {
      case TimeType.actStart:
        this.setState({ body: { ...body, actStartTime: time } });
        break;
      case TimeType.actEnd:
        this.setState({ body: { ...body, actEndTime: time } });
        break;
      case TimeType.applyStart:
        if (!this.checkApplyStartTime(time)) {
          Toast.info({ content: '请选择正确的活动申请开始时间' });
        } else {
          this.setState({ body: { ...body, actApplyStartTime: time } });
        }
        break;
      case TimeType.applyEnd:
        if (!this.checkApplyEndTime(time)) {
          Toast.info({ content: '请选择正确的活动申请结束时间' });
        } else {
          this.setState({ body: { ...body, actApplyEndTime: time } });
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
    this.setState({ body: { ...body, actName: e.target.value } });
  };

  handleActDetailChange = (e) => {
    const { body } = this.state;
    this.setState({ body: { ...body, actDetail: e.target.value } });
  }

  handlePlaceChange = (e) => {
    const { body } = this.state;
    this.setState({ body: { ...body, actPlace: e.target.value } });
  }

  handleDialogOpen = () => {
    this.setState({ visible: true });
  };

  handleDialogClose = () => {
    this.setState({ visible: false });
  };

  handleMoreClick = () => {
    this.setState({ showMore: !this.state.showMore });
  };

  handleDialogConfirm = () => {
    const { body } = this.state;
    if (!body.actStartTime || !body.actEndTime) {
      Toast.info({ content: '活动开始时间和结束时间必填' });
      return false;
    }
    const actApplyStartTime = body.actApplyStartTime ? body.actApplyStartTime : body.actStartTime;
    const actApllyEndTime = body.actApllyEndTime ? body.actApplyEndTime : body.actEndTime;

    console.log({ ...body, actApplyStartTime, actApllyEndTime });
  };

  handleLimitChange = (val) => {
    const { body } = this.state;
    this.setState({ body: { ...body, actPeopleLimitType: val } });
  };

  handleLimitPeopleChange = (e) => {
    const { body } = this.state;
    this.setState({ body: { ...body, actPeopleLimitNum: e.target.value } });
  };

  render() {
    const { siteData } = this.props;
    const platform = siteData.platform === 'h5' ? styles.h5 : styles.pc;
    const isPc = siteData.platform !== 'h5';
    const { visible, showMore, body } = this.state;
    const moreClass = !showMore
      ? classNames(styles['dzqp-act--more'], styles.fold) : classNames(styles['dzqp-act--more'], styles.expand);

    return (
      <>
        <Icon
          onClick={this.handleDialogOpen}
          name="SettingOutlined"
          size="20"
        />
        <Dialog
          visible={visible}
          onCancel={this.handleDialogClose}
          onClose={this.handleDialogClose}
          onConfirm={this.handleDialogConfirm}
          isNew={true}
          type="confirm"
          title="创建活动报名"
          className={classNames(styles['dzqp-act'], platform)}
        >
          <div className={styles['dzqp-act--item']}>
            <div className={styles['dzqp-act--item_title']}>开始时间</div>
            <div className={styles['dzqp-act--item_right']}>
              {isPc
                ? <DatePicker
                    selected={body.actStartTime}
                    minDate={new Date()}
                    onChange={date => this.handleTimeChange(date, TimeType.actStart)}
                    showTimeSelect
                    dateFormat="yyyy/MM/dd HH:mm:ss"
                  />
                : <div>{ formatDate(body.actStartTime, 'yyyy/MM/dd hh:mm:ss') }</div>
              }
              <Icon name="RightOutlined" size="8" />
            </div>
          </div>
          <div className={styles['dzqp-act--item']}>
            <div className={styles['dzqp-act--item_title']}>结束时间</div>
            <div className={styles['dzqp-act--item_right']}>
              {isPc
                ? <DatePicker
                    selected={body.actEndTime}
                    minDate={body.actStartTime}
                    onChange={date => this.handleTimeChange(date, TimeType.actEnd)}
                    showTimeSelect
                    dateFormat="yyyy/MM/dd HH:mm:ss"
                  />
                : <div>{ formatDate(body.actEndTime, 'yyyy/MM/dd hh:mm:ss') }</div>
              }
              <Icon name="RightOutlined" size="8" />
            </div>
          </div>
          <div className={moreClass} onClick={this.handleMoreClick}>
            <span>高级设置</span>
            <Icon name="RightOutlined" size="8" />
          </div>
          {showMore && (
            <>
              <div className={classNames(styles['dzqp-act--item'], styles['act-name'])}>
                <div className={styles['dzqp-act--item_title']}>活动名称</div>
                <Input
                  className={styles['dzqp-act--item_right']}
                  htmlType="text"
                  mode="text"
                  placeholder="最多支持50个字符"
                  maxLength={50}
                  value={body.actName}
                  onChange={this.handleActNameChange}
                />
              </div>
              <div className={classNames(styles['dzqp-act--item'], styles['act-detail'])}>
                <div className={classNames(styles['dzqp-act--item_title'], styles['width-auto'])}>
                  活动详情 <span>最多支持200个字符</span>
                </div>
                <Textarea
                  className={styles['dzqp-act--item_right']}
                  placeholder="请输入活动介绍"
                  rows={4}
                  maxLength={200}
                  value={body.actDetail}
                  onChange={this.handleActDetailChange}
                />
              </div>
              <div className={styles['dzqp-act--item']}>
                <div className={styles['dzqp-act--item_title']}>报名开始</div>
                <div className={styles['dzqp-act--item_right']}>
                  {isPc
                    ? <DatePicker
                        selected={body.actApplyStartTime}
                        minDate={body.actStartTime}
                        maxDate={body.actEndTime}
                        minTime={body.actStartTime}
                        maxTime={body.actEndTime}
                        onChange={date => this.handleTimeChange(date, TimeType.applyStart)}
                        showTimeSelect
                        dateFormat="yyyy/MM/dd HH:mm:ss"
                      />
                    : <div>{ body.actApplyStartTime && formatDate(body.actApplyStartTime, 'yyyy/MM/dd hh:mm:ss') }</div>
                  }
                  <Icon name="RightOutlined" size="8" />
                </div>
              </div>
              <div className={styles['dzqp-act--item']}>
                <div className={styles['dzqp-act--item_title']}>报名结束</div>
                <div className={styles['dzqp-act--item_right']}>
                  {isPc
                    ? <DatePicker
                        selected={body.actApplyEndTime}
                        minDate={body.actStartTime}
                        maxDate={body.actEndTime}
                        minTime={body.actStartTime}
                        maxTime={body.actEndTime}
                        onChange={date => this.handleTimeChange(date, TimeType.applyEnd)}
                        showTimeSelect
                        dateFormat="yyyy/MM/dd HH:mm:ss"
                      />
                    : <div>{ body.actApplyEndTime && formatDate(body.actApplyEndTime, 'yyyy/MM/dd hh:mm:ss') }</div>
                  }
                  <Icon name="RightOutlined" size="8" />
                </div>
              </div>
              <div className={styles['dzqp-act--item']}>
                <div className={styles['dzqp-act--item_title']}>活动地点</div>
                <div className={styles['dzqp-act--item_right']}>
                  <Input
                    className={styles['dzqp-act--item_right']}
                    htmlType="text"
                    mode="text"
                    placeholder="请输入活动地点"
                    maxLength={50}
                    value={body.actPlace}
                    onChange={this.handlePlaceChange}
                  />
                </div>
              </div>
              <div className={styles['dzqp-act--item']}>
                <div className={styles['dzqp-act--item_title']}>人数限制</div>
                <div className={styles['dzqp-act--item_right']}>
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
                </div>
              </div>
              <DatePickers
                onSelects={() => {}}
                isOpen={false}
              />
            </>
          )}
        </Dialog>
      </>
    );
  }
}
