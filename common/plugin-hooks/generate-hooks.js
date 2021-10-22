import PluginCenterInjection from './components/PluginCenterInjection';

export default ({ target, hookNames }) => {
  if (!target || !hookNames) return;

  const [beofroHookName, replaceHookName, afterHookName] = hookNames;

  return (props) => {
    const { className, style, component, ...others } = props;

    return (
      <>
        {/* 前插入hooks */}
        {target && beofroHookName && (
          <PluginCenterInjection
            className={className}
            style={style}
            target={target}
            hookName={beofroHookName}
            pluginProps={{
              ...others,
            }}
          />
        )}

        {/* 替换hooks */}
        {target && replaceHookName ? (
          <PluginCenterInjection
            className={className}
            style={style}
            target={target}
            hookName={replaceHookName}
            pluginProps={{
              ...others,
            }}
          />
        ) : (
          component
        )}

        {/* 后插入hooks */}
        {target && afterHookName && (
          <PluginCenterInjection
            className={className}
            style={style}
            target={target}
            hookName={afterHookName}
            pluginProps={{
              ...others,
            }}
          />
        )}
      </>
    );
  };
};
