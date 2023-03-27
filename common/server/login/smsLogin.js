import {smsLogin} from '@discuzqfe/sdk/dist/api/login/smslogin';
export default async function _smsLogin(opts, ctx) {
  const res = await smsLogin({ ...opts, __context: ctx });
  return res;
}
