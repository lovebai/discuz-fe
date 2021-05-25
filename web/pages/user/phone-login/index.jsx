import React from 'react';
import LoginPhoneH5Page from '@layout/user/h5/phone-login';
import { inject } from 'mobx-react';

import HOCFetchSiteData from '@middleware/HOCFetchSiteData';
import HOCWithNoLogin from '@middleware/HOCWithNoLogin';
import HOCLoginMode from '@middleware/HOCLoginMode';

@inject('site')
class LoginPhone extends React.Component {
  render() {
    const { site } = this.props;
    const { platform } = site;
    return <LoginPhoneH5Page />;
  }
}

// eslint-disable-next-line new-cap
export default HOCFetchSiteData(HOCWithNoLogin(HOCLoginMode('phone')(LoginPhone)));
