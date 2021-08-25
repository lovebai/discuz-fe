import Component from './adapter';

export default class CustomIframPost {
    static pluginName = 'CustomIfram' // 插件名称
    static version = '1.0.0' // 插件版本
    static target = ['plugin_index', 'plugin_detail'] // 插件使用目标
    static hookName = 'thread_extension_display_hook' // 钩子名称
    static platform = ['pc', 'h5', 'mini'];
    static component = <Component/> // 需要渲染的组件
    static options = {} // 需要在注入时提供的额外数据
}