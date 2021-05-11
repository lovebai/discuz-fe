import React, { useMemo } from 'react';
import { Spin } from '@discuzq/design';
import SectionTitle from '@components/section-title';
import NoData from '@components/no-data';
import styles from './index.module.scss';

/**
 * PC端，右侧边栏面板组件（容器）
 * @prop {function} noData 是否出现无数据页面
 * @prop {function} isLoading 是否出现加载数据页面
 */

const Index = (props) => {
  const { 
    noData = true, 
    isLoading = false, 
    children, 
    footer = null, 
    header = null, 
    type = 'small',
    className = '',
    platform = 'pc'
  } = props

  const isNoData = useMemo(() => {
    return !!children && noData
  }, [noData, children])

  const pcStyle = useMemo(() => {
    if (platform === 'pc') {
      const width = type === 'small' ? styles.small : styles.normal
      return `${styles.containerPC} ${width}`
    } else {
      return ''
    }
  }, [platform, type])

  return (
    <div className={`${styles.container} ${pcStyle} ${className}`}>
      {header || <SectionTitle {...props} />}
      {!isLoading && !isNoData && children}
      {!isLoading && isNoData && <NoData />}
      {isLoading && !isNoData && <Spin type="spinner" />}
      {footer}
    </div>
  );
};

export default React.memo(Index);
