import { useStaticRendering } from 'mobx-react';
import { ENV_CONFIG } from '@common/constants/site';
import isServer from '@common/utils/is-server';
import SiteStore from './site/action';
import IndexStore from './index/action';
import UserStore from './user/action';
import ThreadStore from './thread/action';
import CommentStore from './comment/action';
import ThreadPostStore from './thread/post/action';
import UserLoginStore from './login/user-login-store';
import UserRegisterStore from './login/user-register-store';
import MobileLoginStore from './login/mobile-login-store';
import NicknameBindStore from './login/nickname-bind-store';
import SupplementaryStore from './login/supplementary-store';
import MobileBindStore from './login/mobile-bind-store';
import H5QrCode from './login/h5-qrcode';
import SearchStore from './search/action';

useStaticRendering(isServer());

let store = null;

export default function initializeStore(initProps = {}) {
  const { site = {}, user = {} } = initProps;
  if (isServer()) {
    return {
      site: new SiteStore({
        envConfig: ENV_CONFIG,
        ...site,
      }),
      index: new IndexStore(),
      user: new UserStore(user),
      thread: new ThreadStore(),
      userLogin: new UserLoginStore(),
      userRegister: new UserRegisterStore(),
      mobileLogin: new MobileLoginStore(),
      nicknameBind: new NicknameBindStore(),
      supplementary: new SupplementaryStore(),
      mobileBind: new MobileBindStore(),
      comment: new CommentStore(),
      threadPost: new ThreadPostStore(),
      h5QrCode: new H5QrCode(),
      search: new SearchStore(),
    };
  }
  if (store === null) {
    store = {
      site: new SiteStore({
        envConfig: ENV_CONFIG,
        ...site,
      }),
      index: new IndexStore(),
      user: new UserStore(user),
      thread: new ThreadStore(),
      userLogin: new UserLoginStore(),
      userRegister: new UserRegisterStore(),
      mobileLogin: new MobileLoginStore(),
      nicknameBind: new NicknameBindStore(),
      supplementary: new SupplementaryStore(),
      mobileBind: new MobileBindStore(),
      comment: new CommentStore(),
      threadPost: new ThreadPostStore(),
      h5QrCode: new H5QrCode(),
      search: new SearchStore(),
    };
  }

  return store;
}
