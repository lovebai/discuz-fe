import {genH5Qrcode} from '@discuzqfe/sdk/dist/api/login/gen-h5-qrcode';
export default async function _genH5Qrcode(opts, ctx) {
  const res = await genH5Qrcode({ ...opts, __context: ctx });
  return res;
}
