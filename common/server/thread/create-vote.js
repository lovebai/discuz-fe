import { createVote } from '@discuzqfe/sdk/dist/api/content/create-vote';

export default async function _createVote(opts, ctx = null) {
  return await createVote({ ...opts, __context: ctx });
}
