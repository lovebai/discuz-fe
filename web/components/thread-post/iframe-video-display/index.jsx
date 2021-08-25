import React from 'react';
import { RichText } from '@discuzq/design';

const IframeVideoDisplay = ({
  content,
  whiteList = ['bilibili', 'youku', 'iqiyi', 'music.163.com', 'qq.com', 'em.iq.com'],
}) => (
  <RichText
    content={content}
    iframeWhiteList={whiteList}
    onClick={() => {}}
    onImgClick={() => {}}
    onLinkClick={() => {}}
    transformer={parseDom => parseDom}
  />
);

export default IframeVideoDisplay;
