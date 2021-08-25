import PluginCompoent from './PluginComponent';
import dispatchEvent from './dispatchEvent';
import checkProps from './checkProps';

const INJECTION_LIST = {
    'plugin_post@post_extension_entry_hook': (pluginData) => {
        return {
            render: (props) => {
                // 只会提供属于插件自身的数据
                // 必须严格控制可传入到插件的数据

                const { 
                    renderData, 
                    onConfirm, 
                    site, 
                    showPluginDialog = () => {},  
                    closePluginDialog = () => {}
                } = props;

                if ( !checkProps(props) ) {
                    console.warn(`${pluginData.pluginName} -> 缺失插件必须提供参数！`);
                    return null;
                }
                
                let _renderData = null;
                if ( renderData && renderData[pluginData.pluginName] ) {
                    _renderData = renderData[pluginData.pluginName];
                }
                return <PluginCompoent 
                    onConfirm={dispatchEvent(pluginData, onConfirm)}
                    renderData={_renderData}
                    siteData={site}
                    showPluginDialog={dispatchEvent(pluginData, showPluginDialog)}
                    closePluginDialog={dispatchEvent(pluginData, closePluginDialog)}
                    _pluginInfo={{...pluginData}}
                />
            },
            pluginInfo: {...pluginData}
        }
    },
    'plugin_post@post_extension_content_hook': (pluginData) => {
        return {
            render: (props) => {
                // 只会提供属于插件自身的数据
                // 必须严格控制可传入到插件的数据

                const { renderData, site, deletePlugin = () => {}, updatePlugin = () => {} } = props;

                if ( !checkProps(props) ) {
                    console.warn(`${pluginData.pluginName} -> 缺失插件必须提供参数！`);
                    return null;
                }
                
                let _renderData = null;
                if ( renderData && renderData[pluginData.pluginName] ) {
                    _renderData = renderData[pluginData.pluginName];
                }
                return <PluginCompoent
                    renderData={_renderData}
                    siteData={site}
                    deletePlugin={dispatchEvent(pluginData, deletePlugin)}
                    updatePlugin={dispatchEvent(pluginData, updatePlugin)}
                    _pluginInfo={{...pluginData}}
                />
            },
            pluginInfo: {...pluginData}
        }
    },
    'plugin_index@thread_extension_display_hook': (pluginData) => {
        return {
            render: (props) => {
                // 只会提供属于插件自身的数据
                // 必须严格控制可传入到插件的数据

                const { renderData, site } = props;

                if ( !checkProps(props) ) {
                    console.warn(`${pluginData.pluginName} -> 缺失插件必须提供参数！`);
                    return null;
                }

                let _renderData = null;
                if ( renderData && renderData[pluginData.pluginName] ) {
                    _renderData = renderData[pluginData.pluginName];
                }
                return <PluginCompoent
                    siteData={site}
                    renderData={_renderData}
                    _pluginInfo={{...pluginData}}
                />
            },
            pluginInfo: {...pluginData}
        }
    },
    'plugin_detail@thread_extension_display_hook': (pluginData) => {
        return {
            render: (props) => {
                // 只会提供属于插件自身的数据
                // 必须严格控制可传入到插件的数据

                if ( !checkProps(props) ) {
                    console.warn(`${pluginData.pluginName} -> 缺失插件必须提供参数！`);
                    return null;
                }

                const { renderData, site } = props;
                let _renderData = null;
                if ( renderData && renderData[pluginData.pluginName] ) {
                    _renderData = renderData[pluginData.pluginName];
                }
                return <PluginCompoent
                    renderData={_renderData}
                    siteData={site}
                    _pluginInfo={{...pluginData}}
                />
            },
            pluginInfo: {...pluginData}
        }
    }
}

export default function getInjection (name) {
    if ( INJECTION_LIST[name] ) {
        return INJECTION_LIST[name];
    } else {
        return null;
    }
}