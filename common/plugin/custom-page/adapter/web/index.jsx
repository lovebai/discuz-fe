import React from 'react';
import { Icon, Dialog, Button, Input } from '@discuzq/design';

export default class CustomIfram extends React.PureComponent {
  constructor(props) {
    super(props);
    console.log(props);
    this.state = {
      visible: false,
    };
  }

  render() {
    return (
          <>
            plugin 1
        </>
    );
  }
}
