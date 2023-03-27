import {setNickname} from '@discuzqfe/sdk/dist/api/login/setnickname';

export default async function _setNickname(opts, ctx = null) {
  const res = await setNickname({ ...opts, __context: ctx });
  return res;
}
