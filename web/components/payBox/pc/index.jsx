import React from 'react';
import { inject, observer } from 'mobx-react';
import { STEP_MAP } from '@common/constants/payBoxStoreConstants';
import AmountRecognized from './amount-recognized';
import PayConfirmed from './pay-confirmed';
import PayPwd from './payPwd'
import { Dialog } from '@discuzq/design';

@inject('payBox')
@observer
class PayBoxPc extends React.Component {

  onClose = () => {
    // FIXME: 延时回调的修复
    setTimeout(() => {
      this.props.payBox.clear();
    },1000)
  }

  render() {
    return (
      <Dialog visible={this.props.payBox.visible} position="center" maskClosable={true} onClose={this.onClose}>
        {this.props.payBox.step === STEP_MAP.SURE && <AmountRecognized />}
        {this.props.payBox.step === STEP_MAP.PAYWAY && <PayConfirmed />}
        {(this.props.payBox.step === STEP_MAP.WALLET_PASSWORD||this.props.payBox.step === STEP_MAP.SET_PASSWORD) && <PayPwd />}
      </Dialog>
    );
  }
}

export default PayBoxPc;