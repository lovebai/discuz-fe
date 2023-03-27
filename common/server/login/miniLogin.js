import {miniLogin} from '@discuzqfe/sdk/dist/api/login/mini-login';

export default async function _miniLogin(opts, ctx) {
  const res = await miniLogin({ ...opts, __context: ctx });
  return res;
}