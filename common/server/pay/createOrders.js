import {createOrdersCreate} from '@discuzqfe/sdk/dist/api/pay/create-orderscreate';
export default async function _createOrders(opts, ctx = null) {
  const res = await createOrdersCreate({ ...opts, __context: ctx });
  return res;
}