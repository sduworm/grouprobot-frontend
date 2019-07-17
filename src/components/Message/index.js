import React from 'react';
import { Alert } from 'antd';
import Animate from 'rc-animate';

class Message extends React.Component {
  constructor() {
    super();
    this.state = {
      isShow: true,
    };
  }

  // eslint-disable-next-line no-unused-vars
  componentDidUpdate(props, state, __) {
    const { duration } = props;
    const { isShow } = state;
    if (this.timer) {
      clearTimeout(this.timer); // clean old timer
    }
    if (duration && duration !== 0 && isShow) {
      this.timer = setTimeout(() => {
        this.setState({ isShow: false });
      }, duration * 1000);
    }
  }

  componentWillUnmount() {
    clearTimeout(this.timer);
  }

  render() {
    const { type, description } = this.props;
    const { isShow } = this.state;
    return (
      <div>
        <Animate transitionName="fade">
          {isShow ? <Alert type={type} message={description} showIcon /> : null}
        </Animate>
      </div>
    );
  }
}

export default Message;
