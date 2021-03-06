/**
 * @description all模式渲染后端返回路由
 * @param constantRoutes
 * @returns {*}
 */
export function filterAllRoutes(constantRoutes) {
  return constantRoutes.filter((route) => {
    if (route.component) {
      if (route.component === "Layout") {
        route.component = (resolve) => require(["@/layouts"], resolve);
      } else if (route.component === "EmptyLayout") {
        route.component = (resolve) =>
          require(["@/layouts/EmptyLayout"], resolve);
      } else {
        const path = "views/" + route.component;
        route.component = (resolve) => require([`@/${path}`], resolve);
      }
    }
    if (route.children && route.children.length) {
      route.children = filterAllRoutes(route.children);
    }
    if (route.children && route.children.length === 0) {
      delete route.children;
    }
    return true;
  });
}

function hasPermission(permissions, route) {
  if (route.meta && route.meta.permissions) {
    return permissions.some((role) => route.meta.permissions.includes(role));
  } else {
    return true;
  }
}

/**
 * @description intelligence模式根据permissions数组拦截路由
 * @param routes
 * @param permissions
 * @returns {[]}
 */
export function filterAsyncRoutes(routes, permissions) {
  return routes.filter((route) => {
    if (hasPermission(permissions, route)) {
      if (route.children) {
        route.children = filterAsyncRoutes(route.children, permissions);
      }
      return route;
    }
  });
}
