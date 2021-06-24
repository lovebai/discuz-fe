import React, { useEffect, useMemo, useRef, useState, forwardRef } from 'react';
import { Avatar, ImagePreviewer, Icon } from '@discuzq/design';
import { diffDate } from '@common/utils/diff-date';
import { inject, observer } from 'mobx-react';
import s9e from '@common/utils/s9e';
import xss from '@common/utils/xss';
import { getMessageImageSize } from '@common/utils/get-message-image-size';
import styles from './index.module.scss';
import Router from '@discuzq/sdk/dist/router';
import classnames from 'classnames';

const DialogBox = (props, ref) => {
  const { site: { isPC }, message, showEmoji, scrollEnd, messagesList, sendImageAttachment } = props;
  const { dialogMsgList } = message;
  const [previewerVisibled, setPreviewerVisibled] = useState(false);
  const [defaultImg, setDefaultImg] = useState('');

  const imagePreviewerUrls = useMemo(() => {
    return dialogMsgList.list.filter(item => !!item.imageUrl).map(item => item.imageUrl).reverse();
  }, [dialogMsgList]);

  const renderImage = (data) => {
    const { isImageLoading, imageUrl, imageWidth, imageHeight } = data;
    let [width, height] = [200, 0];
    if (isImageLoading) {
      [width, height] = getMessageImageSize(imageWidth, imageHeight, isPC);
    } else {
      const size = imageUrl.match(/\?width=(\d+)&height=(\d+)$/);
      if (size) {
        [width, height] = getMessageImageSize(size[1], size[2], isPC);
      }
    }
    return (
      <div className={styles['msgImage-container']} style={{ width: `${width}px`, height: height ? `${height}px` : 'auto' }}>
        {renderImageStatus(data)}
        <img
          className={styles.msgImage}
          src={imageUrl}
          onClick={() => {
            setDefaultImg(imageUrl);
            setTimeout(() => {
              setPreviewerVisibled(true);
            }, 0);
          }}
          onLoad={scrollEnd}
        />
      </div>
    );
  };

  const renderImageStatus = (data) => {
    const { isImageFail, isImageLoading, file, failMsg } = data;
    const size = isPC ? 30 : 20;

    if (isImageLoading) {
      return (
        <div className={classnames(styles.status, {
          [styles.fail]: isImageFail,
          [styles.uploading]: !isImageFail,
        })}>
          {isImageFail ? (
            <>
              <Icon className={styles.failIcon} name="PictureOutlinedBig" size={size} />
              {failMsg && <span className={styles.failMsg}>{failMsg}</span>}
              <div className={styles.redDot} onClick={() => {
                sendImageAttachment(file, data.dialogId, true);
              }}>!</div>
            </>
          ) : (
            <Icon className={styles.loadingIcon} name="LoadingOutlined" size={size} />
          )}
        </div>
      );
    }
  }

  return (
    <div className={isPC ? styles.pcDialogBox : (showEmoji ? styles['h5DialogBox-emoji'] : styles.h5DialogBox)} ref={ref}>
      <div className={styles.box__inner}>
        {messagesList.map((item) => {
          console.log(imageUrl);
          const { id, timestamp, displayTimePanel, text, ownedBy, userAvatar, imageUrl, userId, nickname, isImageLoading } = item;
          return (
            <React.Fragment key={id}>
              {displayTimePanel && <div className={styles.msgTime}>{diffDate(timestamp)}</div>}
              <div className={`${ownedBy === 'myself' ? `${styles.myself}` : `${styles.itself}`} ${styles.persona}`}>
                <div className={styles.profileIcon} onClick={() => {
                  userId && Router.push({ url: `/user/${userId}` });
                }}>
                  {userAvatar
                    ? <Avatar image={userAvatar} circle={true} />
                    : <Avatar text={nickname && nickname.toUpperCase()[0]} circle={true} style={{
                      backgroundColor: "#8590a6",
                    }} />
                  }
                </div>
                {imageUrl ? (
                  renderImage(item)
                ) : (
                  <div className={styles.msgContent} dangerouslySetInnerHTML={{
                    __html: xss(s9e.parse(text)),
                  }}></div>
                )}
              </div>
            </React.Fragment>
          );
        })}
      </div>
      <ImagePreviewer
        visible={previewerVisibled}
        onClose={() => {
          setPreviewerVisibled(false);
        }}
        imgUrls={imagePreviewerUrls}
        currentUrl={defaultImg}
      />
    </div>
  );
};

export default inject('message', 'user', 'site')(observer(forwardRef(DialogBox)));
