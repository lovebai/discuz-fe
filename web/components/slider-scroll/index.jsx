/**
 * 左滑列表、列表项组件。功能：左滑删除、下拉刷新、上拉加载
 * 需要被渲染的内容使用 RenderItem 以组件形式传入
 * 抛出事件 onPullDown,onScrollBottom,onBtnClick
*/
import React, { Component, PureComponent } from 'react';
import { PullDownRefresh, Icon } from '@discuzq/design';
import classNames from 'classnames';
import styles from './index.module.scss';
import throttle from '@common/utils/thottle';
import PropTypes from 'prop-types';
import List from '@components/list';

/**
 * 左滑列表项
 * @prop {object} item 列表项数据
 * @prop {number} currentId 当前滑动项id
 * @prop {string} offsetLeft 左滑距离,单位px 例如：offsetLeft={'74px'}，左滑74像素
 * @prop {object} RenderItem 列表项渲染组件
 * @prop {function} onBtnClick 处理左滑按钮点击
 */

class SlierItem extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      startX: 0, // x触摸起点
      startY: 0, // y触摸起点
      leftValue: 0, // 左滑距离
    };
  }

  // touchStart，更新当前触摸项，记录起点
  handleTouchStart = (e) => {
    const { item, currentId, onSliderTouch } = this.props;
    currentId !== item.id && onSliderTouch(item.id);
    this.setState({
      startX: e.touches[0].clientX,
      startY: e.touches[0].clientY,
    });
  };

  // touchMove
  handleTouchMove = (e) => {
    const moveX = e.touches[0].clientX - this.state.startX;
    const moveY = e.touches[0].clientY - this.state.startY;
    if (Math.abs(moveX) > Math.abs(moveY) && Math.abs(moveX) > 50) {
      this.setState({
        leftValue: moveX > 0 ? 0 : `-${this.props.offsetLeft}`,
      });
    }
  };

  // 点击滑动项归位
  handleClickToBack = () => {
    this.state.leftValue && this.setState({ leftValue: 0 });
  };

  render() {
    const {
      item = {},
      currentId,
      RenderItem = null,
      offsetLeft,
      iconName,
      iconSize,
      iconText,
      Color,
      Background,
      onBtnClick,
      ...other
    } = this.props;

    return (
      <div
        className={styles['slider-item']}
        style={{
          transform: ` translateX(${currentId === item.id ? this.state.leftValue : 0})`,
        }}
        onTouchStart={this.handleTouchStart}
        onTouchMove={throttle(this.handleTouchMove.bind(this), 30)}
        onClick={this.handleClickToBack}
      >
        {/* 滑块内容展示 */}
        <div className={styles['slider-content']}>{RenderItem && <RenderItem item={item} {...other} />}</div>
        {/* 滑块操作按钮 */}
        <div
          className={styles['slider-brn']}
          style={{
            flexBasis: offsetLeft,
            color: Color,
            background: Background,
          }}
          onClick={() => onBtnClick(item)}
        >
          <Icon className={styles.icon} name={iconName} size={iconSize} />
          {iconText}
        </div>
      </div>
    );
  }
}

SlierItem.propTypes = {
  offsetLeft: PropTypes.string,
  iconName: PropTypes.string,
  iconSize: PropTypes.number,
  iconText: PropTypes.string,
  Color: PropTypes.string,
  Background: PropTypes.string,
  onBtnClick: PropTypes.func,
};

SlierItem.defaultProps = {
  offsetLeft: '74px',
  iconName: 'DeleteOutlined',
  iconSize: 14,
  iconText: '删除',
  Color: '#fff',
  Background: '#e02433',
  onBtnClick: () => { },
};

/**
 * 左滑列表容器
 * @prop {array} list 列表数据
 */
class Index extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentId: 0,
      isTop: false, // 列表位置
      damping: 0, // 下拉距离，下拉时将动态改变
      isFinished: true, // 下拉刷新是否结束
    }
  }

  componentDidMount() {
    // 监听消息项之外的地方的click
    window.addEventListener('click', this.resetSliderId);
  }

  componentWillUnmount() {
    window.removeEventListener('click', this.resetSliderId);
  }

  // 重置滑动块id，让左滑块归位
  resetSliderId = (e) => {
    this.state.currentId && this.setState({ currentId: 0 });
  };

  onScroll = ({ scrollTop }) => {
    const { isTop } = this.state;
    const _isTop = scrollTop === 0;
    isTop !== _isTop && this.setState({
      isTop: _isTop,
      damping: _isTop ? 80 : 0,
    });
  }

  onPullDownRefresh = async () => {
    this.setState({ currentId: 0 });
    if (!this.state.isTop) return;
    this.setState({ isFinished: false });
    await this.props.onPullDown();
    this.setState({ isFinished: true });
  }

  render() {
    const {
      list,
      noMore,
      height,
      withTopBar,
      withBottomBar,
      topCard,
      onPullDown,
      onScrollBottom,
      ...other
    } = this.props;
    const { isFinished, damping, currentId } = this.state;

    return (
      <div className={classNames(styles.wrapper, {
        [styles['with-top']]: withTopBar,
        [styles['with-bottom']]: withBottomBar,
      })}>
        <PullDownRefresh
          onRefresh={this.onPullDownRefresh}
          isFinished={isFinished}
          height={600}
          damping={damping}
        >
          <List
            height={height}
            noMore={noMore}
            onScroll={throttle(this.onScroll, 10)}
            onRefresh={onScrollBottom}
          >
            {/* 顶部导航卡片 */}
            {topCard}
            {/* show list */}
            <div className={styles.slider}>
              {list.map((item, index) => (
                <SlierItem
                  key={item.id}
                  item={item}
                  index={index}
                  isLast={list.length === (index + 1)}
                  currentId={currentId}
                  onSliderTouch={(id) => this.setState({ currentId: id })}
                  {...other}
                />
              ))}
            </div>
          </List>
        </PullDownRefresh>
      </div>
    );
  }
}

Index.propsTypes = {
  height: PropTypes.string,
  noMore: PropTypes.bool,
  withTopBar: PropTypes.bool,
  withBottomBar: PropTypes.bool,
  topCard: PropTypes.object,
  list: PropTypes.array,
  onPullDown: PropTypes.func,
  onScrollBottom: PropTypes.func,
}

Index.defaultProps = {
  height: '100vh',
  noMore: false,
  withTopBar: false,
  withBottomBar: false,
  topCard: null,
  list: [],
  onPullDown: () => Promise.resolve(true),
  onScrollBottom: () => { },
}

export default Index;
