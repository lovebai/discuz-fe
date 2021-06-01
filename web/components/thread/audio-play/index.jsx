import React, { useRef } from 'react';
import { inject, observer } from 'mobx-react';
import styles from './index.module.scss';
import { Audio } from '@discuzq/design';
import { noop } from '../utils';

/**
 * 语音
 * @prop {boolean} isPay 是否需要付费
 * @prop {string | number} money 付费金额
 * @prop {string} url 音频地址
 * @prop {function} goCheckAudio 音频点击事件
 */

const Index = ({ isPay = false, url, onPay = noop, baselayout }) => {

  const ref = useRef();

  const onPlay = (e) => {
    // if(baselayout.playingAudioDom) {
    //   baselayout.playingVideoDom.querySelector("video").pause();
    //   baselayout.playingAudioDom.current?.props?.onPause();
    // }
    // ref.current.props.disabled = true;
    // baselayout.playingAudioDom = ref;
    // baselayout.playingAudioPos = e.target.parentNode.parentNode.parentNode.offsetTop;
    // console.log(`baselayout`, baselayout)
  };

  return (
    <div className={styles.container}>
      {
        isPay ? (
          <div className={styles.wrapper}>
            <img src='/dzq-img/pay-audio.png' className={styles.payBox} onClick={onPay}></img>
          </div>
        ) : <Audio src={url} onPlay={onPlay} disabled={!url} ref={ref}/>
      }
    </div>
  );
};

export default inject('baselayout')(observer(Index));
