import { readWechatPosterGenqrcode } from '@discuzqfe/sdk/dist/api/other/read-wechatpostergenqrcode';
export default async function _readWechatPosterGenqrcode(opts = {}, ctx = null) {
  const res = await readWechatPosterGenqrcode({ ...opts, __context: ctx });
  return res;
}
