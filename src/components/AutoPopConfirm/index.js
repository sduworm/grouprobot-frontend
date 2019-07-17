import React from 'react';
import { Popconfirm } from 'antd';
import style from './index.less';

/**
 *  可使用于 被form.getFieldDecorator包裹的 radio select组件
 *  被包裹控件不需要进行改造
 *  如传递visible 则popConfirm的显示隐藏需要自身控制
 *  如传递onConfirm onCancel则此控件相当于一个普通的popConfirm
 *  其它props内容直接透传
 *  fixme 对于switch 还没有兼容 因为它的显示与change事件不同步
 */
export default class AutoPopConfirm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
    };
  }

  componentDidMount() {
    this.popNode.addEventListener('click', this.onClick, true);
  }

  componentWillUnmount() {
    if (this.popNode) {
      this.popNode.removeEventListener('click', this.onClick);
    }
  }

  onClick = event => {
    if (event.target.value === undefined) {
      event.stopPropagation();
    }
  };

  render() {
    const { children, popProps } = this.props;
    const { visible } = this.state;

    // 点击弹出框取消
    const onCancel = () => {
      this.onChange = undefined;
      this.setState({ visible: false });
    };

    // 点击弹出框确认
    const onConfirm = () => {
      // 对于某些控件 onChange中的参数可能直接为一个值 而不是event
      if (this.onChange) {
        this.onChange(this.eventWait);
      }
      onCancel();
    };

    // 加工过的onChange 将change事件截断 当点击确认按钮后触发
    const getOnChange = (onChange, value) => e => {
      const newValue = e.target ? e.target.value : e;
      if (!visible && newValue !== value) {
        this.onChange = onChange && e ? () => onChange(e) : undefined;
        this.setState({ visible: true });
      }
    };

    // 设置点击触发节点
    const setNode = node => {
      // 卸载时也会走
      if (node) {
        this.popNode = node;
      }
    };

    return (
      <div>
        {visible ? <div onClick={onCancel} className={style.cover} /> : null}
        <div
          ref={node => {
            setNode(node);
          }}
          className="test"
        >
          <Popconfirm visible={visible} onCancel={onCancel} onConfirm={onConfirm} {...popProps}>
            {React.Children.map(children, child => {
              const { onChange, value } = child.props;
              return React.cloneElement(child, {
                onChange: getOnChange(onChange, value),
              });
            })}
          </Popconfirm>
        </div>
      </div>
    );
  }
}
