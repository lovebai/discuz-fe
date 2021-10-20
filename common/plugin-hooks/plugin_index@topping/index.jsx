import generateHooks from '../generate-hooks';


/**DZQ->plugin->register<plugin_index@topping_replace_hook,topping_insert_before_hook,topping_insert_after_hook>**/
export default generateHooks({
  target: 'plugin_index',
  hookNames: ['topping_insert_before_hook', 'topping_replace_hook', 'topping_insert_after_hook'],
});
