export default function dispatchEvent(pluginData, fn) {
    return (data) => {
        fn({
            _pluginInfo: pluginData,
            ...data
        })
    }
}