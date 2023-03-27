import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import Taro from '@tarojs/taro';
import Button from '@discuzqfe/design/dist/components/button/index';
import Input from '@discuzqfe/design/dist/components/input/index';
import Toast from '@discuzqfe/design/dist/components/toast/index';
import Spin from '@discuzqfe/design/dist/components/spin/index';
import styles from './index.module.scss';
import CaptchaInput from './captcha-input/index';
import VerifyCode from './verify-code/index';
import Router from '@discuzqfe/sdk/dist/router';
import { View, Text } from '@tarojs/components';
import throttle from '@common/utils/thottle.js';
import classNames from 'classnames';
import { toTCaptcha } from '@common/utils/to-tcaptcha';

@inject('site')
@inject('user')
@observer
class index extends Component {
  constructor(props) {
    super(props);
    this.state = {
      list: [],
      currentStep: 'first', // 表示当前步骤
      bindMobile: null,
      isBlur: false, // 表示是否失焦
      isKeyBoardVisible: false, // 表示是否显示键盘
      isSubmit: false, // 是否点击提交
      initTimeValue: null,
      initTime: 60,
      interval: null,
      initTimeText: '发送验证码',
    };
  }
  initState = (type) => {
    this.setState({
      list: [],
      currentStep: type ? type : 'first', // 表示当前步骤
      bindMobile: null,
      isBlur: false, // 表示是否失焦
      isKeyBoardVisible: false, // 表示是否显示键盘
      isSubmit: false,
      initTimeValue: null,
      initTime: 60,
      interval: null,
      initTimeText: '发送验证码',
    });
  };

  // 点击切换弹出键盘事件
  handleKeyBoardVisible = () => {
    this.setState({
      isKeyBoardVisible: !this.state.isKeyBoardVisible,
    });
  };

  updatePwd = (set_num, type) => {
    const { list = [] } = this.state;
    if (type == 'add') {
      let list_ = [...list];
      if (list.length >= 6) {
        return;
      }
      this.setState(
        {
          list: [].concat(list_, [set_num]),
        },
        () => {
          if (this.state.list.length === 6) {
            // this.submitPwa();
            this.handleKeyBoardVisible();
          }
        },
      );
    } else if (type == 'delete') {
      this.setState({
        list: list.slice(0, list.length - 1),
      });
    }
  };

  // 点击下一步
  handleStepBtn = throttle(async () => {
    if (this.getDisabledWithButton()) return;
    this.setState({
      isSubmit: true,
    });
    const { list = [], currentStep, bindMobile } = this.state;
    if (list.length !== 6) return;
    if (currentStep === 'first') {
      this.props.user.oldMobileVerifyCode = list.join('');
      this.props.user
        .verifyOldMobile()
        .then((res) => {
          if (this.state.interval != null) {
            clearInterval(this.state.interval);
          }
          this.initState('second');
        })
        .catch((err) => {
          Toast.error({
            content: err.Message || '验证失败',
            hasMask: false,
            duration: 2000,
          });
          this.initState();
          this.props.user.oldMobileVerifyCode = null;
        });
    } else if (currentStep === 'second') {
      this.props.user.newMobile = bindMobile;
      this.props.user.newMobileVerifyCode = list.join('');
      await this.props.user
        .rebindMobile()
        .then((res) => {
          Toast.success({
            content: '绑定成功',
            hasMask: false,
            duration: 2000,
          });
          setTimeout(() => {
            Taro.redirectTo({ url: '/userPages/my/index' });
            this.initState();
          }, 1000);
        })
        .catch((err) => {
          Toast.error({
            content: err.Message || '修改失败',
            hasMask: false,
            duration: 2000,
          });
          this.initState('second');
        });
    }
  }, 300);

  handleInputChange = (e) => {
    this.setState({
      bindMobile: e.target.value,
    });
  };

  handleInputFocus = (e) => {
    this.setState({
      isBlur: false,
    });
  };

  handleInputBlur = (e) => {
    this.setState({
      isBlur: true,
    });
  };

  componentDidUpdate = async (prevProps) => {
    if (this.props.ticket && this.props.randstr) {
      if (!prevProps.ticket || !prevProps.randstr) {
        try {
          this.getVerifyCode({});
        } catch (e) {
          console.log(e);
        }
      }
    }
  };

  getVerifyCode = throttle(async ({ calback }) => {
    const { originalMobile } = this.props.user;
    const { currentStep } = this.state;
    if (currentStep === 'first') {
      // 验证码
      const { webConfig } = this.props.site;
      const qcloudCaptcha = webConfig?.qcloud?.qcloudCaptcha;
      if (qcloudCaptcha) {
        if (!this.props.ticket || !this.props.randstr) {
          const qcloudCaptchaAppId = webConfig?.qcloud?.qcloudCaptchaAppId;
          toTCaptcha(qcloudCaptchaAppId);
          return false;
        }
      }
      // const { captchaRandStr, captchaTicket } = await this.props.showCaptcha();
      this.props.user
        .sendSmsVerifyCode({
          mobile: originalMobile,
          captchaRandStr: this.props.randstr,
          captchaTicket: this.props.ticket,
        })
        .then((res) => {
          this.setState({
            initTimeValue: res.interval,
          });
          if (calback && typeof calback === 'function') calback();
          this.props.clearCaptchaData();
        })
        .catch((err) => {
          Toast.error({
            content: err.Message || '发送验证码失败',
            hasMask: false,
            duration: 2000,
          });
          this.setState({
            list: [],
          });
          this.props.clearCaptchaData();
          if (calback && typeof calback === 'function') calback(err);
        });
    } else if (currentStep === 'second') {
      const { bindMobile } = this.state;
      const { webConfig } = this.props.site;

      const qcloudCaptcha = webConfig?.qcloud?.qcloudCaptcha;
      if (qcloudCaptcha) {
        if (!this.props.ticket || !this.props.randstr) {
          const qcloudCaptchaAppId = webConfig?.qcloud?.qcloudCaptchaAppId;
          toTCaptcha(qcloudCaptchaAppId);
          return false;
        }
      }

      this.props.user
        .sendSmsUpdateCode({
          mobile: bindMobile,
          captchaRandStr: this.props.randstr,
          captchaTicket: this.props.ticket,
        })
        .then((res) => {
          this.setState({
            initTimeValue: res.interval,
          });
          this.props.clearCaptchaData();
          if (calback && typeof calback === 'function') calback();
        })
        .catch((err) => {
          Toast.error({
            content: err.Message || '发送验证码失败',
            hasMask: false,
            duration: 2000,
          });
          this.setState({
            bindMobile: null,
          });
          this.props.clearCaptchaData();
          if (calback && typeof calback === 'function') calback(err);
        });
    }
  }, 300);

  validateTel = (value) => /^[1][3-9]\d{9}$/.test(value);

  /**
   * 获取按钮禁用状态
   * @returns true 表示禁用 false表示不禁用
   */
  getDisabledWithButton = () => {
    const { currentStep, list = [], bindMobile, isSubmit } = this.state;
    let isDisabled = false;
    if (isSubmit) {
      isDisabled = isSubmit;
    } else if (currentStep === 'first') {
      isDisabled = list.length !== 6;
    } else if (currentStep === 'second') {
      isDisabled = list.length !== 6 || !this.validateTel(bindMobile);
    }
    return isDisabled;
  };

  render() {
    const { currentStep, list = [], isBlur, bindMobile, initTimeValue, isKeyBoardVisible, isSubmit } = this.state;
    const { mobile } = this.props?.user;
    const valuePassCheck = currentStep === 'second' ? this.validateTel(bindMobile) : true;
    return (
      <View id={styles.editMobileContent}>
        <View className={styles.content}>
          {currentStep === 'first' && <Text className={styles.setTtile}>验证旧手机</Text>}
          <View className={styles.labelInfo}>
            {currentStep === 'first' ? (
              <View>
                <Text className={styles.labelName}>原手机号</Text>
                <Text className={styles.labelValue}>{mobile}</Text>
              </View>
            ) : (
              <View className={styles.labelInput}>
                <Input
                  trim
                  placeholder="请输入新手机号"
                  onChange={this.handleInputChange}
                  focus={true}
                  onBlur={this.handleInputBlur}
                  onFocus={this.handleInputFocus}
                  value={bindMobile}
                  type="number"
                  trim
                />
              </View>
            )}
            <View>
              <VerifyCode
                initTimeValue={initTimeValue}
                valuePassCheck={valuePassCheck}
                key={currentStep}
                text={'发送验证码'}
                getVerifyCode={this.getVerifyCode}
              />
            </View>
          </View>
          <View className={styles.bindCode}>
            <Text>请输入短信验证码</Text>
            <CaptchaInput
              handleKeyBoardVisible={this.handleKeyBoardVisible}
              isKeyBoardVisible={isKeyBoardVisible}
              currentStep={currentStep}
              updatePwd={this.updatePwd}
              list={list}
              isBlur={isBlur}
            />
          </View>
        </View>
        <View
          className={classNames(styles.bottom, {
            [styles.btnPosition]: !!isKeyBoardVisible,
            [styles.bgBtnColor]: !this.getDisabledWithButton(),
          })}
        >
          <Button
            full
            disabled={this.getDisabledWithButton()}
            onClick={this.handleStepBtn}
            type={'primary'}
            className={styles.btn}
          >
            {isSubmit ? <Spin type="spinner">提交中...</Spin> : '提交'}
          </Button>
        </View>
      </View>
    );
  }
}

export default index;
