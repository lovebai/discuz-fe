import { readCommentList } from '@discuzqfe/sdk/dist/api/thread/read-commentlist';

export default async function _readCommentList(opts, ctx = null) {
  return await readCommentList({ ...opts, __context: ctx });
}
