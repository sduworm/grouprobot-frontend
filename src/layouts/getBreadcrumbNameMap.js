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

export default function getBreadcrumbNameMap1(props) {
  const routerMap = {};
  const mergeMenuAndRouter = data => {
    data.forEach(menuItem => {
      if (menuItem.children) {
        mergeMenuAndRouter(menuItem.children);
      }
      // Reduce memory usage
      routerMap[menuItem.path] = menuItem;
    });
  };
  mergeMenuAndRouter(formatter(props));
  return routerMap;
}
