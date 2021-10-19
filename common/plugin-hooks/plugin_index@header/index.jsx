import generateHooks from '../generate-hooks';

export default generateHooks({
  target: 'plugin_index',
  hookNames: ['header_insert_before_hook', 'header_insert_after_hook', 'header_insert_after_hook'],
});
