import { usernameLogin } from '@discuzqfe/sdk/dist/api/login/usernamelogin';
export default async function _usernameLogin(opts, ctx = null) {
  return await usernameLogin({ ...opts, __context: ctx });
}
