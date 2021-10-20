import generateHooks from '../generate-hooks';

/**DZQ->plugin->register<plugin_index@qrcode_replace_hook>**/
export default generateHooks({
  target: 'plugin_index',
  hookNames: [, 'qrcode_replace_hook'],
});
