import React, { useState } from 'react';
import styles from './index.module.scss';
import { Button } from '@discuzqfe/design';
import Header from '@components/header';
import Copyright from '@components/copyright';

export default function ErrorPage(props) {
  const [text] = useState(props.text || '服务器错误 SERVER ERROR');

  const onReflush = () => {
    window.location.reload();
  };

  return (
    <div className={styles.page}>
      <Header></Header>

      <div className={styles.body}>
        <img alt="图片" className={styles.icon} src="/dzq-img/error.png" />
        <span className={styles.text}>{text}</span>
        <Button onClick={onReflush} className={styles.button} type="primary">
          点我刷新
        </Button>
      </div>

      <div className={styles.footer}>
        <Copyright></Copyright>
      </div>
    </div>
  );
}
