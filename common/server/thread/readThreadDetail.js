import { readThreadDetail } from '@discuzqfe/sdk/dist/api/thread/read-threaddetail';

export default async function _readThreadDetail(opts, ctx = null) {
  return await readThreadDetail({ ...opts, __context: ctx });
}
