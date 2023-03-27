import {h5WechatCodeBind} from '@discuzqfe/sdk/dist/api/login/h5-wechat-code-bind';

export default async function _h5WechatCodeBind(opts, ctx) {
  const res = await h5WechatCodeBind({ ...opts, __context: ctx });
  return res;
}
