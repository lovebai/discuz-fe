import DZQPluginCenterReplaceInjectionPolyfill from '../../../web/utils/DZQPluginCenterReplaceInjectionPolyfill';

let PluginCenterReplaceInjection = DZQPluginCenterReplaceInjectionPolyfill;

if (process.env.DISCUZ_ENV === 'mini') {
  const DZQPluginCenterReplaceInjection = require('@discuzq/plugin-center/dist/components/DZQPluginCenterReplaceInjection');
  PluginCenterReplaceInjection = DZQPluginCenterReplaceInjection;
}

export default PluginCenterReplaceInjection;
