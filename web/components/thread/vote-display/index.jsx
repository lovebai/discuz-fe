import React from 'react';
import styles from './index.module.scss';

const VoteDisplay = () => (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles['header-right']}>你认为，催婚到底在催什么？你认为，催婚到底在催什么？</div>
        <div className={styles['header-left']}>45人参与</div>
      </div>
      <div className={styles.content}>

      </div>
      <div className={styles.footer}></div>
    </div>
);

export default VoteDisplay;
