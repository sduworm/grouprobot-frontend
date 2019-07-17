import React from 'react';
import lodash from 'lodash';
import Link from 'umi/link';
import logo from '../../assets/logo.png';
import styles from './index.less';

// eslint-disable-next-line
class Index extends React.PureComponent {
  render() {
    const { location } = window;
    const { hash } = location;
    const UpperPath = lodash.toUpper(hash);
    const isUserPages = lodash.startsWith(UpperPath, '#/USER/');

    const logoImg = <img src={logo} alt="logo" className={styles.logo} />;
    return isUserPages ? <Link to="/user/login">{logoImg}</Link> : logoImg;
  }
}
export default Index;
