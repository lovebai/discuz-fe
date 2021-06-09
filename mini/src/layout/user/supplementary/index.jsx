import React from 'react';
import { inject, observer } from 'mobx-react';
import Button from '@discuzq/design/dist/components/button/index';
import Toast from '@discuzq/design/dist/components/toast/index';
import '@discuzq/design/dist/styles/index.scss';
import { View } from '@tarojs/components';
import layout from './index.module.scss';
import { getSignInFields, setSignInFields } from '@server';
// import PcBodyWrap from '../components/pc-body-wrap';
import HomeHeader from '@components/home-header';
import { InputType, CreateFunctions } from './components';
import Router from '@discuzq/sdk/dist/router';

@inject('site')
@inject('user')
@inject('thread')
@inject('supplementary')
@observer
class SupplementaryH5Page extends React.Component {
  async componentDidMount() {
    try {
      const res = await getSignInFields();
      this.props.supplementary.fields = res.data;
      this.props.supplementary.values = this.props.supplementary.fields?.map((field) => {
        let defaultValue;
        switch (field.type) {
          case InputType.RADIO_GROUP:
          case InputType.FILE:
          case InputType.PHOTO:
            defaultValue = [];
            break;
          default:
            defaultValue = '';
        }
        return { ...field, value: defaultValue };
      });
    } catch (e) {
      Toast.error({
        content: e,
        duration: 2000,
      });
    }
  }

  createComponent(field) {
    const f = CreateFunctions[field.type];
    if (!f) return <></>;
    return f(field, layout);
  }

  processData = () => {
    const { fields, values } = this.props.supplementary;
    return values.map((v, index) => {
      if (v.required === 1 && v.value.length === 0) {
        throw new Error(`${v.name}字段未填写`);
      }
      let fieldsExt;
      let options;
      if (v.value.length) {
        switch (v.type) {
          case InputType.INPUT:
          case InputType.TEXTAREA:
            fieldsExt = v.value;
            break;
          case InputType.FILE:
          case InputType.PHOTO:
            fieldsExt = v.value.map((file) => {
              const { url, id, uuid, name } = file;
              return { url, id, uuid, name };
            });
            break;
          case InputType.RADIO_GROUP:
            ({ options } = JSON.parse(v.fieldsExt));
            fieldsExt = {
              options: options.map((option) => {
                option.checked = option.value === v.value;
                return option;
              }),
            };
            break;
          case InputType.CHECKBOX_GROUP:
            const valueSet = new Set(v.value);
            ({ options } = JSON.parse(v.fieldsExt));
            fieldsExt = {
              options: options.map((option) => {
                option.checked = valueSet.has(option.value);
                return option;
              }),
            };
            break;
        }
      }
      fieldsExt = JSON.stringify(fieldsExt);
      return { ...fields[index], fieldsExt };
    });
  };

  gotoIndex = () => {
    Router.push({ url: '/pages/index/index' });
  };

  submit() {
    try {
      const { values } = this.props.supplementary;
      const data = this.processData(values);

      setSignInFields({ data: { data } }).then(() => {
        Toast.success({
          content: '提交成功',
          duration: 2000,
        });
        setTimeout(() => {
          this.gotoIndex();
        }, 1000);
      });
    } catch (e) {
      // todo 优化错误处理
      console.log(e);
      Toast.error({
        content: e.message || e,
        duration: 2000,
      });
    }
  }

  render() {
    const { values } = this.props.supplementary;

    return (
      <View className={layout.container}>
        <HomeHeader hideInfo hideMinibar />
        <View className={layout.content}>
          {values?.map((field) => this.createComponent(field))}
          <Button type="primary" className={layout.button} onClick={() => this.submit()}>
            注册
          </Button>
        </View>
      </View>
    );
  }
}

export default SupplementaryH5Page;