import React from 'react';
import PluginStore from './store';
import browser from './browser';
import getInjection from './getInjection';

class DZQPluginCenterClass extends PluginStore {
    PLUGIN_TARGET_CONST = ['plugin_index', 'plugin_detail', 'plugin_post'];
    DEFAULT_PLATFORM = ['pc', 'h5', 'mini'];

    // 注册
    register(plugin) {
        const isPass = this.validationPlugin(plugin);
        if (!isPass) return;
        this.setStore(plugin);
    }

    // 注入插件
    injection(target, hookName) {
        const pluginList = this.getStore(target, hookName) || [];
        const injectList = [];
        for ( let i = 0; i < pluginList.length; i++ ) {
            const currInjection = getInjection(`${target}@${pluginList[i].hookName}`);
            if (currInjection) {
                injectList.push(currInjection(pluginList[i]))
            }
        }
        return injectList
    }

    // 检查插件必要属性
    validationPlugin(plugin) {
        let isPass = true;
        const {
            pluginName = null, // 插件名称
            version = null, // 插件版本
            target = null, // 插件使用目标
            hookName = null, // 挂载钩子
            component = null, // 插件组件
            platform = [] // 平台
        } = plugin;

        if ( !pluginName || pluginName == '' ) {
            console.warn(`插件名不合法，当前插件名：${pluginName}`);
            isPass = false;
        }
        if ( !version || version == '' || !(/^[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}$/.test(version)) ) {
            console.warn(`${pluginName} -> 插件版本号不合法，当前插件版本：${version}`);
            isPass = false;
        }
        if ( !target ) {
            console.warn(`${pluginName} -> 插件目的标识不合法，当前插件目标标识：${target}`);
            isPass = false;
        } else {
            // 字符串
            if ( Object.prototype.toString.call(target) === '[object String]' && target !== '' && this.PLUGIN_TARGET_CONST.indexOf(target) !== -1 ) {
                isPass = true;
            // 数组
            } else if ( Array.isArray(target) && target.length !== 0 ) {

                for (let i = 0; i < target.length; i++) {
                    if ( this.PLUGIN_TARGET_CONST.indexOf(target[i]) === -1 ) {
                        isPass = false;
                        console.warn(`${pluginName} -> 插件目的标识不合法，当前插件目标标识：${target}`);
                        break;
                    }
                }
            } else {
                console.warn(`${pluginName} -> 插件目的标识不合法，当前插件目标标识：${target}`);
                isPass = false;
            }
        }
        if ( !hookName || hookName == '' ) {
            console.warn(`${pluginName} -> 插件钩子名不合法，当前钩子名称：${hookName}`);
            isPass = false;
        }
        if ( !component || !React.isValidElement(component) ) {
            console.warn(`${pluginName} -> 插件组件不合法`);
            isPass = false;
        }
        if ( !platform || platform.length === 0 ) {
            console.warn(`${pluginName} -> 平台必须至少指定一个，${this.DEFAULT_PLATFORM}`);
            isPass = false;
        } else if ( platform.indexOf('pc') === -1 && platform.indexOf('h5') === -1 && platform.indexOf('mini') === -1 ) {
            console.warn(`${pluginName} -> 平台必须包含以下选中中一个：${this.DEFAULT_PLATFORM}`);
            isPass = false;
        // 根据平台确定是否注册
        } else {
            const currEnv = process.env.DISCUZ_ENV === 'mini' ? 'mini' : browser.env('mobile') ? 'h5' : 'pc';
            if ( platform.indexOf(currEnv) === -1 ) {
                console.info(`${pluginName} -> 当前平台不能注册此插件，当前插件可以用范围：${platform}`);
                isPass = false;
            }
        }

        return isPass;
    }
}

const DZQPluginCenter = new DZQPluginCenterClass();

export default DZQPluginCenter;