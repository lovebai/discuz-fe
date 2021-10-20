import generateHooks from '../generate-hooks';

/**DZQ->plugin->register<plugin_index@header_replace_hook,header_insert_before_hook,header_insert_after_hook>**/

export default generateHooks({
  target: 'plugin_index',
  hookNames: ['header_insert_before_hook', 'header_replace_hook', 'header_insert_after_hook'],
});
