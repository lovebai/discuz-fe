import { readCommentDetail } from '@discuzqfe/sdk/dist/api/thread/read-commentdetail';

export default async function _readCommentDetail(opts, ctx = null) {
  return await readCommentDetail({ ...opts, __context: ctx });
}
