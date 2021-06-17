import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { ImagePreviewer, Flex } from '@discuzq/design';
import { noop } from '../utils';
import styles from './index.module.scss';
import SmartImg from '@components/smart-image';
const { Col, Row } = Flex;

// TODO 图片懒加载
const Index = ({ imgData = [], platform = 'h5', isPay = false, onPay = noop, onImageReady = () => {} }) => {
  const [visible, setVisible] = useState(false);
  const [defaultImg, setDefaultImg] = useState('');
  const ImagePreviewerRef = React.useRef(null);
  const [firstImgData, setFirstImgData] = useState(null);

  const imagePreviewers = useMemo(() => imgData.map((item) => item.url), [imgData]);
  useEffect(() => {
    if (visible && ImagePreviewerRef && ImagePreviewerRef.current) {
      ImagePreviewerRef.current.show();
    }
  }, [visible]);

  useEffect(() => {
    let timer;
    if ( imgData && imgData.length !== 0 ) {
      const img = new Image();
      img.src = imgData[0].thumbUrl;
      // 超时处理
      timer = setTimeout(() => {
        if ( firstImgData === null ) {
          setFirstImgData('fail');
        }
      }, 2000);
      if (img.complete) {
        // 如果图片被缓存，则直接返回缓存数据
        if ( !img.naturalWidth || !img.naturalHeight  ) {
          setFirstImgData('fail');
        }
        setFirstImgData({
          width: img.naturalWidth,
          height: img.naturalHeight
        });
      } else {
          img.onload = function () {
            timer && clearTimeout(timer);
            if ( !img.naturalWidth || !img.naturalHeight  ) {
              setFirstImgData('fail');
            } else {
              setFirstImgData({
                width: img.naturalWidth,
                height: img.naturalHeight
              });
            }
          }
          img.onerror = function() {
            timer && clearTimeout(timer);
            setFirstImgData('fail');
          }
      }
    }
    return () => {
      timer && clearTimeout(timer);
    }
  }, [imgData]);

  // 当更新了firstImgData，代表确定了布局方式，可以通知外部更新
  useEffect(() => {
    onImageReady && onImageReady();
  }, [firstImgData]);

  const onClick = (id) => {
    if (isPay) {
      onPay();
    } else {
      imgData.forEach((item) => {
        if (item.id === id) {
          setDefaultImg(item.url);
          setVisible(true);
        }
      });
    }
  };

  const onClickMore = (e) => {
    e.stopPropagation();

    setDefaultImg(imgData[4].url);
    setTimeout(() => {
      setVisible(true);
    }, 0);
  };

  const style = useMemo(() => {
    const num = imgData.length > 5 ? 5 : imgData?.length;
    return `containerNum${num}`;
  }, [imgData]);

  const handleImages = () => {
    if (imgData.length < 3) {
      return { bigImages: imgData, smallImages: [] };
    }
    if (imgData.length < 5) {
      return { bigImages: [imgData[0]], smallImages: imgData.slice(1, imgData.length + 1) };
    }
    return { bigImages: [imgData[0], imgData[1]], smallImages: [imgData[2], imgData[3], imgData[4]] };
  };

  const calcImageType = useCallback((width, height) => {
    if ( width >= height ) {
      // 全景图
      if ( width/height >= 2 ) {
        return 'panorama'
      } else {
        return 'transverse'
      }
    } else {
      // 长图
      if ( height/width >= 2.5 ) {
        return 'long'
      } else {
        return 'longitudinal'
      }
    }
  }, []);

  const setImageDefaultType = useCallback((n) => {
    if (n === 3) {
      return 'longitudinal';
    } else {
      return 'panorama';
    }
  }, [])

  const ImageView = useMemo(() => {
    if ( !imgData || imgData.length === 0 ) {
      return null;
    }
    if ( firstImgData === null ) return <div className={`${platform === 'h5' ? styles['placeholderH5'] : styles['placeholderPC']}`}/>;
    const res = handleImages();
    const type = firstImgData === 'fail' ? setImageDefaultType(imgData.length) : calcImageType(firstImgData.width, firstImgData.height);

    if (imgData.length === 1) {
      return <One type={type} bigImages={res.bigImages} onClick={onClick} smallImages={res.smallImages} style={style} />;
    }
    if (imgData.length === 2) {
      return <Two type={type} bigImages={res.bigImages} onClick={onClick} smallImages={res.smallImages} style={style} />;
    }
    if (imgData.length === 3) {
      return <Three type={type} bigImages={res.bigImages} onClick={onClick} smallImages={res.smallImages} style={style} />;
    }
    if (imgData.length === 4) {
      return <Four type={type} bigImages={res.bigImages} onClick={onClick} smallImages={res.smallImages} style={style} />;
    }
    if (imgData.length >= 5) {
      return (
        <Five
          type={type}
          bigImages={res.bigImages}
          onClick={onClick}
          smallImages={res.smallImages}
          style={style}
          imgData={imgData}
          onClickMore={onClickMore}
        />
      );
    }
    return null;
  }, [imgData, firstImgData]);

  return (
    <div className={`${platform === 'h5' ? styles.container : styles.containerPC}`}>
      {ImageView}
      {visible && (
        <ImagePreviewer
          ref={ImagePreviewerRef}
          onClose={() => {
            setVisible(false);
          }}
          imgUrls={imagePreviewers}
          currentUrl={defaultImg}
        />
      )}
    </div>
  );
};

export default React.memo(Index);

const One = ({ type, bigImages, onClick, style }) => {
  const item = bigImages[0];
  return (
    <div className={`${styles[style]} ${styles[type]}`}>
      <SmartImg type={item.fileType} src={item.thumbUrl} onClick={() => onClick(item.id)} />
    </div>
  );
};

const Two = ({ type, bigImages, onClick, style }) => (
  <Row gutter={4} className={`${styles[style]} ${styles[type]} ${styles.row}`}>
    {bigImages.map((item, index) => (
      <Col span={6} className={styles.col} key={index}>
        <SmartImg type={item.fileType} src={item.thumbUrl} onClick={() => onClick(item.id)} />
      </Col>
    ))}
  </Row>
);

const Three = ({ type, bigImages, smallImages, onClick, style }) => {
  if ( type === 'long' || type === 'longitudinal' ) {
    return (
      <div className={`${styles[style]} ${styles[type]}`}>
        <Row gutter={4}>
          <Col span={8} className={styles.col}>
            <SmartImg type={bigImages[0].fileType} src={bigImages[0].thumbUrl} onClick={() => onClick(bigImages[0].id)} />
          </Col>
          <Col span={4} className={styles.col}>
            <Row gutter={4} className={styles.smallRow}>
              {smallImages.map((item, index) => (
                <Col span={12} key={index} className={styles.smallCol}>
                  {false&&<SmartImg type={item.fileType} src={item.thumbUrl} onClick={() => onClick(item.id)} />}
                </Col>
              ))}
            </Row>
          </Col>
        </Row>
      </div>
      
    );
  }
  return (
    <div className={`${styles[style]} ${styles[type]}`}>
      <div className={styles.bigImages}>
        <SmartImg type={bigImages[0].fileType} src={bigImages[0].thumbUrl} onClick={() => onClick(bigImages[0].id)} />
      </div>
      <Row gutter={4} className={styles.smallImages}>
        {smallImages.map((item, index) => (
          <Col span={6} className={styles.col} key={index}>
            <SmartImg type={item.fileType} src={item.thumbUrl} onClick={() => onClick(item.id)} />
          </Col>
        ))}
      </Row>
    </div>
  );
}

const Four = ({ type, bigImages, smallImages, onClick, style }) => (
  <Row gutter={4} className={styles[style]}>
    <Col span={8} className={styles.col}>
      <SmartImg type={bigImages[0].fileType} src={bigImages[0].thumbUrl} onClick={() => onClick(bigImages[0].id)} />
    </Col>
    <Col span={4} className={styles.col}>
      <Row gutter={4} className={styles.smallRow}>
        {smallImages.map((item, index) => (
          <Col span={12} key={index} className={styles.smallCol}>
            <SmartImg type={item.fileType} src={item.thumbUrl} onClick={() => onClick(item.id)} />
          </Col>
        ))}
      </Row>
    </Col>
  </Row>
);


const Five = ({ type, bigImages, smallImages, onClick, style, imgData = [], onClickMore }) => (
  <div className={styles[style]}>
    <Row gutter={4} className={styles.bigImages}>
      {bigImages.map((item, index) => (
        <Col span={6} className={styles.col} key={index}>
          <SmartImg type={item.fileType} src={item.thumbUrl} onClick={() => onClick(item.id)} />
        </Col>
      ))}
    </Row>
    <Row gutter={4} className={styles.smallImages}>
      {smallImages.map((item, index) => (
        <Col span={4} className={styles.col} key={index}>
          <SmartImg type={item.fileType} src={item.thumbUrl} onClick={() => onClick(item.id)} />
          {imgData?.length > 5 && index === smallImages.length - 1 && (
            <div className={styles.modalBox} onClick={onClickMore}>{`+${imgData.length - 5}`}</div>
          )}
        </Col>
      ))}
    </Row>
  </div>
);


