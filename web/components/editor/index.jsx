/**
 * 编辑器
 * 基于 vditor 开源组件：https://github.com/Vanessa219/vditor
 */
import React, { useState, useEffect } from 'react';
import Vditor from '@discuzq/vditor';
import classNames from 'classnames';
import { baseOptions, baseToolbar } from './options';
import { MAX_COUNT } from '@common/constants/thread-post';
import LoadingBox from '@components/loading-box';
import './index.scss';
import '@discuzq/vditor/src/assets/scss/index.scss';

export default function DVditor(props) {
  const { pc, onChange, emoji = {}, atList = [], topic, onFocus, onBlur, value, onCountChange } = props;
  const vditorId = 'dzq-vditor';

  const [isFocus, setIsFocus] = useState(false);
  const [vditor, setVditor] = useState(null);
  const [contentCount, setContentCount] = useState(0);

  const setCurrentPositon = () => {
    // https://developer.mozilla.org/zh-CN/docs/Web/API/Selection
    const selection = window.getSelection();
    // 将所有的区域都从选区中移除。
    selection.removeAllRanges();
    // 直接获取当前编辑器的 range
    const { range } = vditor.vditor[vditor.vditor.currentMode];
    // 一个区域（Range）对象将被加入选区。
    if (range) selection.addRange(range);
  };

  useEffect(() => {
    if (!vditor) initVditor();
    return () => {
      if (vditor && vditor.destroy) vditor.destroy();
    };
  }, []);

  useEffect(() => {
    if (emoji && emoji.code) {
      // setCurrentPositon();
      // 因为vditor的lute中有一些emoji表情和 emoji.code 重叠了。这里直接先这样处理
      const value = `<img alt="${emoji.code}emoji" src="${emoji.url}" class="qq-emotion" />`;
      const md = vditor.html2md(value);
      vditor.insertValue(md.substr(0, md.length - 1));
    }
  }, [emoji]);

  useEffect(() => {
    if (atList && !atList.length) return;
    const users = atList.map((item) => {
      if (item.user) return ` @${item.user.userName} `;
      return '';
    });
    if (users.length) {
      // setCurrentPositon();
      const md = vditor.html2md(users.join(''));
      vditor && vditor.insertValue(md.substr(0, md.length - 1));
    }
  }, [atList]);

  useEffect(() => {
    if (topic) {
      // setCurrentPositon();
      const md = vditor.html2md(` ${topic} `);
      vditor && vditor.insertValue(md.substr(0, md.length - 1));
    }
  }, [topic]);

  // useEffect(() => {
  //   onCountChange(contentCount);
  // }, [contentCount]);

  useEffect(() => {
    try {
      const timer = setTimeout(() => {
        clearTimeout(timer);
        if ((vditor && vditor.getValue && vditor.getValue() !== '\n') || !value) return;
        if (vditor && vditor.getValue && vditor.getValue() === '\n' && vditor.getValue() !== value) {
          // setCurrentPositon();
          vditor.setValue && vditor.setValue(value);
        }
      }, 200);
    } catch (error) {
      console.log(error);
    }
  }, [value]);

  function initVditor() {
    // https://ld246.com/article/1549638745630#options
    const editor = new Vditor(
      vditorId,
      {
        _lutePath: 'https://imgcache.qq.com/operation/dianshi/other/lute.min.6cbcbfbacd9fa7cda638f1a6cfde011f7305a071.js?max_age=31536000',
        ...baseOptions,
        height: pc ? 200 : 178,
        // 编辑器初始化值
        value,
        after: () => {
          editor.setValue(value);
        },
        focus: () => {
          setIsFocus(false);
          onFocus('focus');
        },
        input: () => {
          onChange(editor);
        },
        blur: () => {
          // onChange(editor);
          // 兼容Android的操作栏渲染
          const timer = setTimeout(() => {
            clearTimeout(timer);
            setIsFocus(false);
            onBlur();
          }, 100);
        },
        // 编辑器中选中文字后触发，PC才有效果
        select: (value) => {
          if (value) {
            onFocus('select');
            setIsFocus(true);
          } else setIsFocus(false);
        },
        counter: {
          enable: false,
          after(count) {
            setContentCount(count);
          },
          type: 'markdown',
          max: MAX_COUNT,
        },
        toolbarConfig: {
          hide: !!pc,
          pin: true,
          bubbleHide: false,
        },
        bubbleToolbar: pc ? [...baseToolbar] : [],
      },
    );
    setVditor(editor);
  }

  const className = pc ? 'dvditor pc' : classNames('dvditor h5', { 'no-focus': !pc && !isFocus });

  return (
    <>
      {!vditor && <LoadingBox>编辑器加载中...</LoadingBox>}
      <div id={vditorId} className={className}></div>
      {/* {!pc && isFocus && <div className="dvditor__placeholder"></div>} */}
    </>
  );
}
