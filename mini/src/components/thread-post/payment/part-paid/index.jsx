/**
 * @description 部分付费页面组件
 * @author fishcui
 */
import React from 'react';
import { View } from '@tarojs/components';
import TextUnit from '@components/thread-post/payment/part-paid/units/textUnit';
import ImageUnit from '@components/thread-post/payment/part-paid/units/imageUnit';
import VideoUnit from '@components/thread-post/payment/part-paid/units/videoUnit';
import AudioUnit from '@components/thread-post/payment/part-paid/units/audioUnit';
import AttachmentUnit from '@components/thread-post/payment/part-paid/units/attachmentUnit';
import PriceUnit from '@components/thread-post/payment/part-paid/units/priceUnit';

class PartPaid extends React.Component {
  render() {
    return (
      <View>
        <TextUnit />
        <ImageUnit />
        <VideoUnit />
        <AudioUnit />
        <AttachmentUnit />
        <PriceUnit />
      </View>
    );
  }
}

export default PartPaid;
