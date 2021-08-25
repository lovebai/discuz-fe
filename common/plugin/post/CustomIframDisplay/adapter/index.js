let pluginComponent = () => {};
if (process.env.DISCUZ_ENV === 'mini') {
    // taro项目的小程序
    pluginComponent = require('./mini.jsx');
}
if (process.env.DISCUZ_ENV === 'web') {
    pluginComponent = require('./web.jsx');
}

export default pluginComponent.default;