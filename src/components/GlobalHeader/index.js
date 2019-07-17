import React from 'react';
import Link from 'umi/link';
import styles from './index.less';
import RightContent from './RightContent';
import LogoImg from '../LogoImg';

export default class GlobalHeader extends React.PureComponent {
  render() {
    const { isMobile, logo } = this.props;
    return (
      <div className={styles.header}>
        {isMobile && (
          <Link to="/" className={styles.logo} key="logo">
            <img src={logo} alt="logo" width="32" />
          </Link>
        )}
        <LogoImg />
        <RightContent {...this.props} />
      </div>
    );
  }
}
