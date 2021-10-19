let block = (props) => <div {...props}>{props.children}</div>;

if (process.env.DISCUZ_ENV === 'mini') {
  const { View } = require('@tarojs/components');
  block = (props) => <View {...props}>{props.children}</View>;
}

export default block;
