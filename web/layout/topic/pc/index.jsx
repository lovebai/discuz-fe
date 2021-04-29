import React from 'react';
import { inject, observer } from 'mobx-react';
import styles from './index.module.scss';

@inject('site')
@inject('user')
@inject('index')
@observer
class IndexPCPage extends React.Component {
  render() {
    return (
      <div className={styles.container}>
       话题
      </div>
    );
  }
}
export default IndexPCPage;