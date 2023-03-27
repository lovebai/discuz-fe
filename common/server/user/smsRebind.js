import {smsRebind} from '@discuzqfe/sdk/dist/api/login/smsrebind';

export default async function _smsRebind(opts, ctx) {
  const res = await smsRebind({ ...opts, __context: ctx });
  return res;
}
