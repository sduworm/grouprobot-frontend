import React from 'react';
import _ from 'lodash';
import DocumentTitle from 'react-document-title';
import isEqual from 'lodash/isEqual';
import memoizeOne from 'memoize-one';
import styles from './UserLayout.less';
import LogoImg from '../components/LogoImg';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import Context from './MenuContext';
import getBreadcrumbNameMap from './getBreadcrumbNameMap';

class UserLayout extends React.PureComponent {
  constructor(props) {
    super(props);
    this.getBreadcrumbNameMap = memoizeOne(getBreadcrumbNameMap, isEqual);
  }

  render() {
    const { children, location } = this.props;
    const { pathname } = location;
    const UpperPath = _.toUpper(pathname);
    const isLoginPage = UpperPath === '/USER/LOGIN';
    const {
      route: { routes },
    } = this.props;
    const contextData = {
      location,
      breadcrumbNameMap: this.getBreadcrumbNameMap(routes),
    };
    return (
      <DocumentTitle title="Group Robot">
        <div className={styles.container}>
          <div className={styles.header}>
            <LogoImg />
          </div>
          <div className={isLoginPage ? styles.content : styles.notLoginContent}>
            {isLoginPage ? (
              children
            ) : (
              <div style={{ height: '100%', overflow: 'hidden' }}>
                <Context.Provider value={contextData}>
                  <PageHeaderWrapper className={styles.bread} />
                </Context.Provider>
                <div className={styles.childContainer}>{children}</div>
              </div>
            )}
          </div>
        </div>
      </DocumentTitle>
    );
  }
}

export default UserLayout;
