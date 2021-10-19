import DZQPluginCenter from '@discuzq/plugin-center';
import Block from './components/block';

export default ({ target, hookNames }) => {
  if (!target || !hookNames) return;

  const [beofroHookName, replaceHookName, afterHookName] = hookNames;

  return (props) => {
    const { component, ...others } = props;
    const insertBeforePlugins = beofroHookName && DZQPluginCenter.injection(target, beofroHookName);
    const replacePlugin = replaceHookName && DZQPluginCenter.injection(target, replaceHookName).pop();
    const insertAfterPlugins = afterHookName && DZQPluginCenter.injection(target, afterHookName);
    return (
      <>
        {/* 前插入hooks */}
        {insertBeforePlugins?.length > 0 &&
          insertBeforePlugins.map(({ render, pluginInfo }) => (
            <Block key={pluginInfo.name} className="before">
              {render({
                ...others,
              })}
            </Block>
          ))}

        {/* 替换hooks */}
        {replacePlugin && replacePlugin.pluginInfo ? (
          <Block key={replacePlugin.pluginInfo.name} className="replace">
            {replacePlugin.render({
              ...others,
            })}
          </Block>
        ) : (
          component
        )}

        {/* 后插入hooks */}
        {insertAfterPlugins?.length > 0 &&
          insertAfterPlugins.map(({ render, pluginInfo }) => (
            <Block key={pluginInfo.name} className="after">
              {render({
                ...others,
              })}
            </Block>
          ))}
      </>
    );
  };
};
