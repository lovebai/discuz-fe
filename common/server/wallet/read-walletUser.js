import {readWalletUser} from '@discuzqfe/sdk/dist/api/wallet/read-walletuser';

export default async function _readWalletUser(opts, ctx = null) {
  const res = await readWalletUser({ ...opts, __context: ctx });
  return res;
}