import React from 'react';
import { Layout } from 'antd';
import _ from 'lodash';
import DocumentTitle from 'react-document-title';
import isEqual from 'lodash/isEqual';
import memoizeOne from 'memoize-one';
import { connect } from 'dva';
import { ContainerQuery } from 'react-container-query';
import classNames from 'classnames';
import pathToRegexp from 'path-to-regexp';
import { unenquireScreen } from 'enquire-js';
import { formatMessage } from 'umi/locale';
import SiderMenu from '@/components/SiderMenu';
import Authorized from '@/utils/Authorized';
import SettingDrawer from '@/components/SettingDrawer';
import logo from '../assets/logo.png';
import Header from './Header';
import Context from './MenuContext';
import Exception403 from '../pages/Exception/403';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import style from './BasicLayout.less';
import { urlToList } from '../components/_utils/pathTools';
import getBreadcrumbNameMap from './getBreadcrumbNameMap';

const { Content } = Layout;

// Conversion router to menu.
function formatter(data, parentAuthority, parentName) {
  return data
    .map(item => {
      let locale = 'menu';
      if (parentName && item.name) {
        locale = `${parentName}.${item.name}`;
      } else if (item.name) {
        locale = `menu.${item.name}`;
      } else if (parentName) {
        locale = parentName;
      }
      if (item.path) {
        const result = {
          ...item,
          locale,
          authority: item.authority || parentAuthority,
        };
        if (item.routes) {
          // Reduce memory usage
          result.children = formatter(item.routes, item.authority, locale);
        }
        delete result.routes;
        return result;
      }

      return null;
    })
    .filter(item => item);
}

const query = {
  'screen-xs': {
    maxWidth: 575,
  },
  'screen-sm': {
    minWidth: 576,
    maxWidth: 767,
  },
  'screen-md': {
    minWidth: 768,
    maxWidth: 991,
  },
  'screen-lg': {
    minWidth: 992,
    maxWidth: 1199,
  },
  'screen-xl': {
    minWidth: 1200,
    maxWidth: 1599,
  },
  'screen-xxl': {
    minWidth: 1600,
  },
};

class BasicLayout extends React.PureComponent {
  constructor(props) {
    super(props);
    this.getPageTitle = memoizeOne(this.getPageTitle);
    this.getBreadcrumbNameMap = memoizeOne(getBreadcrumbNameMap, isEqual);
    const {
      route: { routes },
    } = this.props;
    this.breadcrumbNameMap = this.getBreadcrumbNameMap(routes);
  }

  state = {
    rendering: true,
    menuData: this.getMenuData(),
  };

  componentDidMount() {
    const { dispatch, location, currentUser } = this.props;
    if (_.isEmpty(currentUser)) {
      dispatch({
        type: 'user/fetchCurrent',
      });
    }
    this.renderRef = requestAnimationFrame(() => {
      this.setState({
        rendering: false,
      });
    });
    const { pathname } = location;
    if (pathname !== '/') {
      dispatch({
        type: 'global/setBaseMenu',
        payload: urlToList(pathname)[0],
      });
    }
  }

  componentDidUpdate() {
    // After changing to phone mode,
    // if collapsed is true, you need to click twice to display
    const {
      route: { routes },
    } = this.props;
    this.breadcrumbNameMap = this.getBreadcrumbNameMap(routes);
  }

  componentWillUnmount() {
    cancelAnimationFrame(this.renderRef);
    unenquireScreen(this.enquireHandler);
  }

  getContext() {
    const { location } = this.props;
    return {
      location,
      breadcrumbNameMap: this.breadcrumbNameMap,
    };
  }

  getMenuData() {
    const {
      route: { routes },
    } = this.props;
    return formatter(routes);
  }

  getRightContainerStyle() {
    const { fixSiderbar, collapsed } = this.props;
    if (fixSiderbar) {
      const paddingLeft = collapsed ? 80 : 200;
      return {
        paddingLeft,
      };
    }
    return {};
  }

  matchParamsPath = pathname => {
    const pathKey = Object.keys(this.breadcrumbNameMap)
      .filter(key => pathToRegexp(key.split('?')[0]).test(pathname))
      .pop(); // 从使用find方式选取第一个匹配，改为像BaseMenu.js中一样的：使用filter + pop方式，按最后一个命中的匹配
    return this.breadcrumbNameMap[pathKey];
  };

  getPageTitle = pathname => {
    const currRouterData = this.matchParamsPath(pathname);

    if (!currRouterData) {
      return 'Group Robot';
    }
    const message = formatMessage({
      id: currRouterData.locale || currRouterData.name,
      defaultMessage: currRouterData.name,
    });
    return `${message} - Group Robot`;
  };

  handleMenuCollapse = collapsed => {
    const { dispatch } = this.props;
    dispatch({
      type: 'global/changeLayoutCollapsed',
      payload: collapsed,
    });
  };

  renderSettingDrawer() {
    // Do not render SettingDrawer in production
    // unless it is deployed in preview.pro.ant.design as demo
    const { rendering } = this.state;
    if ((rendering || process.env.NODE_ENV === 'production') && APP_TYPE !== 'site') {
      return null;
    }
    return <SettingDrawer />;
  }

  render() {
    // 目前父组件中去除了isMobile的逻辑 子组件中仍保留 如后续确认只在WEB端使用则去除子组件逻辑
    const {
      navTheme,
      layout: PropsLayout,
      children,
      location: { pathname },
      fixedHeader,
    } = this.props;
    const { menuData } = this.state;
    const isTop = PropsLayout === 'topmenu';
    const routerConfig = this.matchParamsPath(pathname);
    const layout = (
      <Layout className={style.common}>
        <Layout
          style={{
            minHeight: '100vh',
          }}
          className={style.bkColor}
        >
          <Header
            menuData={menuData}
            handleMenuCollapse={this.handleMenuCollapse}
            logo={logo}
            isMobile={false}
            {...this.props}
          />
          <Layout className={fixedHeader ? style.fixedContentContainer : style.contentContainer}>
            {isTop ? null : (
              <SiderMenu
                logo={logo}
                Authorized={Authorized}
                theme={navTheme}
                onCollapse={this.handleMenuCollapse}
                menuData={menuData}
                isMobile={false}
                {...this.props}
              />
            )}
            <Content
              key={pathname}
              className={style.rightContent}
              style={this.getRightContainerStyle()}
            >
              <PageHeaderWrapper>
                <Authorized
                  authority={routerConfig && routerConfig.authority}
                  noMatch={<Exception403 />}
                >
                  <Layout className={style.innerContent}>{children}</Layout>
                </Authorized>
              </PageHeaderWrapper>
            </Content>
          </Layout>
        </Layout>
      </Layout>
    );
    return (
      <React.Fragment>
        <DocumentTitle title={this.getPageTitle(pathname)}>
          <ContainerQuery query={query}>
            {params => (
              <Context.Provider value={this.getContext()}>
                <div className={classNames(params)}>{layout}</div>
              </Context.Provider>
            )}
          </ContainerQuery>
        </DocumentTitle>
        {this.renderSettingDrawer()}
      </React.Fragment>
    );
  }
}

export default connect(({ global, setting, user }) => ({
  collapsed: global.collapsed,
  layout: setting.layout,
  currentUser: user.currentUser,
  ...setting,
}))(BasicLayout);
