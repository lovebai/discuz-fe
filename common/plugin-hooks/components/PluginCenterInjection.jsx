import DZQPluginCenterInjectionPolyfill from '../../../web/utils/DZQPluginCenterInjectionPolyfill';

let PluginCenterInjection = DZQPluginCenterInjectionPolyfill;

if (process.env.DISCUZ_ENV === 'mini') {
  const DZQPluginCenterInjection = require('@discuzq/plugin-center/dist/components/DZQPluginCenterInjection');
  PluginCenterInjection = DZQPluginCenterInjection;
}

export default PluginCenterInjection;
