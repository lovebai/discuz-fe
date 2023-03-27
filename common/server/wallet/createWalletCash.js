
import { createWalletCash } from '@discuzqfe/sdk/dist/api/wallet/create-walletcash';
export default async function _createWalletCash(opts, ctx = null) {
  const res = await createWalletCash({ ...opts, __context: ctx });
  return res;
}
