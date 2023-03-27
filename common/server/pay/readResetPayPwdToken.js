import {readResetPayPwdToken} from '@discuzqfe/sdk/dist/api/pay/read-resetpaypwdtoken';
export default async function _readResetPayPwdToken(opts, ctx = null) {
  const res = await readResetPayPwdToken({ ...opts, __context: ctx });
  return res;
}
