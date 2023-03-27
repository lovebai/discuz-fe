import { shareThread } from '@discuzqfe/sdk/dist/api/thread/share-thread';

export default async function _shareThread(opts, ctx = null) {
  return await shareThread({ ...opts, __context: ctx });
}
