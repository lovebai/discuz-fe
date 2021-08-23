export default class PluginStore {
    store = {}

    setStore(plugin) {
        const {
            pluginName,
            target,
            hookName
        } = plugin;

        if ( Object.prototype.toString.call(target) === '[object String]' ) {
            if ( !this.store[target] ) {
                this.createTargetObject(target);
            }

            if ( !this.store[target][hookName] ) {
                this.createHookObject(target, hookName);
            }

            // 对比版本
            if ( this.store[target][hookName][pluginName] ) {
                const old = this.store[target][hookName][pluginName].plugin;
                const resultPlugin = this.compareVersion(old, plugin);
                this.store[target][hookName][pluginName] = this.createPluginInfo(resultPlugin);
            } else {
                this.store[target][hookName][pluginName] = this.createPluginInfo(plugin);

            }
        // 数组
        } else {
            for (let i = 0; i < target.length; i++) {
                if ( !this.store[target[i]] ) {
                    this.createTargetObject(target[i]);
                }

                if ( !this.store[target[i]][hookName] ) {
                    this.createHookObject(target[i], hookName)
                }

                // 对比版本
                if ( this.store[target[i]][hookName][pluginName] ) {
                    const old = this.store[target[i]][hookName][pluginName].plugin;
                    const resultPlugin = this.compareVersion(old, plugin);
                    this.store[target[i]][hookName][pluginName] = this.createPluginInfo(resultPlugin);
                } else {
                    this.store[target[i]][hookName][pluginName] = this.createPluginInfo(plugin);
                }
            }
        }
    }

    getStore(target, hookName) {
        let list = [];
        if ( this.store[target] ) {

            for ( let key in this.store[target][hookName]  ) {
                list.push({
                    ...this.store[target][hookName][key]
                });
            }
        }
        return list;
    }

    // 创建插件记录
    createPluginInfo(plugin) {
        const {
            pluginName,
            version,
            target,
            hookName,
            component,
            platform,
            options = {}
        } = plugin;
        return {
            version,
            pluginName: pluginName,
            target: target,
            hookName: hookName,
            plugin: plugin,
            Component: component,
            platform,
            options
        };
    }

    // 创建命名空间
    createTargetObject(target) {
        this.store[target] = {}
    }

     // 创建命名空间
     createHookObject(target, hookName) {
        this.store[target][hookName] = {}
    }


    // 对比版本，只取最新版本
    compareVersion(oldPlugin, currPlugin) {
        const { version: oldVersion } = oldPlugin;
        const { version: currVersion } = currPlugin;
        const oldVersionNum = oldVersion.split('.').join('');
        const currVersionNum = currVersion.split('.').join('');
        return oldVersionNum > currVersionNum ? oldPlugin : currPlugin;
    }
}