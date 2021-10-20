import React, { useRef, useEffect, useState } from 'react';
import { inject, observer } from 'mobx-react';
import ImageDisplay from '@components/thread/image-display';
import UserInfo from '@components/thread/user-info';
import styles from './index.module.scss';
import htmlparser2 from 'htmlparser2';


const ThreadCard = inject('user', 'card', 'comment')(observer((props) => {
  const { commentDetail: data } = props.comment;
  const { isReady, imgReadyLength, imgReady } = props.card;
  const nickname = data?.user?.nickname;
  const avatar = data.user?.avatar;
  const content = useRef(null);
  const [overMaxHeight, setOverMaxHeight] = useState(false);

  useEffect(() => {
    if (!data?.IMAGE) {
      props.card.setImgReady();
    }
    if (imgReadyLength === data?.images?.length) {
      props.card.setImgReady();
      props.card.clearImgReadyLength();
    }
    if (imgReady && content?.current?.scrollHeight >= 1900) {
      setOverMaxHeight(true);
    }
  });
  const postLoad = () => {
    props.card.setImgReadyLength();
  };
  const posthandle = str => (str.length > 6 ? `${str.slice(0, 6)}...` : str);

  const contentText = [];
  const { Parser } = htmlparser2;
  const parse = new Parser({
    ontext(text) {
      contentText.push(text);
    },
    onclosetag(tagname) {
      // 处理换行
      if (tagname === 'br') {
        contentText.push('\n');
      }
    },
  });


  parse.parseComplete(data.content);

  return (
    <div>
      {isReady && (
      <div className={`${styles.container}`}>
        <div className={styles.header}>
          <div className={styles.userInfo}>
            <UserInfo
              name={ posthandle(nickname || '')}
              avatar={avatar || ''}
              groupName={data?.user?.groups?.name || ''}
              time={`${data?.createdAt}` || ''}
              userId={data?.user?.id}
            ></UserInfo>
          </div>
        </div>

        <div className={styles.body} ref={content}>

          {/* 文字 */}
          <div className={styles.commentText}>{contentText.join('')}</div>


          {/* 图片 */}
          {data.images && (
            <ImageDisplay
              flat
              platform="h5"
              imgData={data.images}
              showLongPicture={false}
              postLoad={postLoad}
            />
          )}

        </div>
        {overMaxHeight && (
            <div className={styles.lookmoreBox}>
              <img src="/dzq-img/look-more.jpg" alt="扫码查看更多" className={styles.lookmoreImg}/>
            </div>
        )}
      </div>
      )}

    </div>
  );
}));

export default ThreadCard;

