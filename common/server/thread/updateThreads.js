import {updateThreads} from '@discuzqfe/sdk/dist/api/content/update-threads';

export default async function _updateThreads(opts, ctx = null) {
  const res = await updateThreads({ ...opts, __context: ctx });
  return res;
}