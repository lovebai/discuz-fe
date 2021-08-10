import React, { useEffect, useState } from 'react';
import { inject, observer } from 'mobx-react';
import { getMiniCode } from '@server';
import styles from './index.module.scss';
import QRCode from 'qrcode.react';

const Index = ({ site, setReady, threadId = '' }) => {
  const [miniCode, setMiniCode] = useState('');
  const [miniConfig, setMiniConfig] = useState(true);
  const defaultLogo = '/dzq-img/default-logo.png';
  const { siteName } = site.webConfig?.setSite || '';
  const threadPath = `/indexPages/thread/index?id=${threadId}`;
  const sitePath = '/indexPages/index/index';
  const path = threadId ? threadPath : sitePath;
  const paramPath = `/pages/index/index?path=${encodeURIComponent(path)}`;
  useEffect(async () => {
    try {
      const res = await getMiniCode({ params: { path: paramPath } });
      if (res?.code === 0) {
        setMiniCode(res?.data.base64Img);
      } else {
        setMiniConfig(false);
      }
    } catch {
      setMiniCode(defaultLogo);
    }
    setReady(true);
  }, []);
  return (
        <div className={styles.footerBox}>
            {!miniConfig
              ? <QRCode value={paramPath} size={96}></QRCode>
              : <img src={miniCode} className={styles.footerImg}/>}
            <span className={styles.desc}>
                {`长按识别${miniConfig ? '小程序' : '二维码'}查看详情`}
            </span>
            <span className={styles.siteName}>
                {`来自${siteName}`}
            </span>
        </div>
  );
};

export default inject('site')(observer(Index));
