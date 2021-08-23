import React, { useState, useEffect } from 'react';
import DDialog from '@components/dialog';
import { Radio, Input, Popup, Button } from '@discuzq/design';
import classNames from 'classnames';
import styles from './index.module.scss';

const LOCAL = 'local';
const NETWORK = 'network';
const CHOOSE_TYPE = {
  [LOCAL]: '本地上传',
  [NETWORK]: '网络插入',
};

const IframeVideo = ({ visible = true, pc, onConfirm, onClose }) => {
  const [value, setValue] = useState(LOCAL);
  const [confirmText, setConfirmText] = useState('上传');
  const [iframe, setIframe] = useState('');

  const content = (
    <>
      <Radio.Group defaultValue={value} className={styles['radio-reverse']} onChange={val => setValue(val)}>
        {Object.keys(CHOOSE_TYPE).map(item => <Radio name={item} key={item}>{CHOOSE_TYPE[item]}</Radio>)}
      </Radio.Group>
      {value === NETWORK && (
        <>
          <div className={styles.item}>
            <span className={styles.label}>网络音视频iframe代码</span>
            <Input value={iframe} onChange={e => setIframe(e.target.value)} />
          </div>
          <div className={classNames(styles.item, styles.flextop)}>
            <span className={styles.left}>*</span>
            <span className={styles.right}>目前仅支持插入爱奇艺、优酷、B站视频; 网易云音乐音频</span>
          </div>
        </>
      )}
    </>
  );

  useEffect(() => {
    if (value === LOCAL) setConfirmText('上传');
    if (value === NETWORK) setConfirmText('插入');
  }, [value]);

  if (!pc) return (
    <Popup
      className={styles.popup}
      position="bottom" // 从哪个地方弹出 'bottom' | 'top' | 'center';
      maskClosable={true} // 点击遮罩层是否关闭弹出层，但好像没什么用
      visible={visible} // 是否显示弹出层
      onClose={() => {
        // 遮罩层点击关闭回调,传一个'取消'，可自定义更改
        // handleClose();
      }}
    >
      {content}
      <div className={styles.btn}>
        <Button onClick={onClose}>取消</Button>
        <Button type="primary" disabled={value === NETWORK && !iframe} onClick={() => onConfirm()}>{confirmText}</Button>
      </div>
    </Popup>
  );

  return (
    <DDialog
      visible={visible}
      confirmText={confirmText}
      confirmDisabled={value === NETWORK && !iframe}
      className={value === LOCAL ? styles.local : styles.network}>
      {content}
    </DDialog>
  );
};

export default IframeVideo;
