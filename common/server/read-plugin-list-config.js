import { readPluginList } from '@discuzq/sdk/dist/api/plugin/read-plugin-list';
export default async function _readPluginListConfig(opts = {}, ctx = null) {
  const res = await readPluginList({ ...opts, __context: ctx });
  return res;
}
