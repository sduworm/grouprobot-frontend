export default [
  // user
  {
    path: '/user',
    component: '../layouts/UserLayout',
    routes: [
      { path: '/user', redirect: '/user/login' },
      { path: '/user/login', component: './User/Login' },
    ],
  },
  // app
  {
    path: '/',
    component: '../layouts/BasicLayout',
    Routes: ['src/pages/Authorized'],
    authority: ['administrator', 'staff'],
    routes: [
      {
        path: '/',
        redirect: '/paas/link',
      },
      {
        name: 'meta',
        component: './Exception/404',
        path: '/*/meta-page/:metaId',
        hideInMenu: true,
      },
      {
        name: 'meta-sub-page',
        component: './Exception/404',
        path: '/*/meta-page/:metaId/**',
        hideInMenu: true,
      },
      {
        name: 'paas',
        path: '/paas',
        authority: ['administrator', 'staff'],
        routes: [
          {
            path: '/paas/link',
            redirect:
              '/paas/meta-page/student?type=composite-view&cmpId=5bcaf29f4f50ea29fc8772d0&metaOpStatus=search',
          },
          {
            name: 'edit-student',
            icon: 'user',
            path:
              '/paas/meta-page/edit-student?type=form&cmpId=5bcaf19a4f50ea56945e7f71&metaOpStatus=edit&filterId=5bab3eb94f50ea512410d468',
            authority: ['administrator'],
          },
          {
            name: 'view-student',
            icon: 'user',
            path:
              '/paas/meta-page/view-student?type=form&cmpId=5bcaf19a4f50ea56945e7f71&metaOpStatus=view&filterId=5bab3eb94f50ea512410d468',
            authority: ['administrator'],
          },
          {
            name: 'view-detailStudent',
            icon: 'user',
            path:
              '/paas/meta-page/edit-studentDetail?type=composite-form&cmpId=5bcaf6404f50ea54a870f2c2&metaOpStatus=view&filterId=5bab3eb94f50ea512410d468',
            authority: ['administrator'],
          }
        ],
      },
      {
        component: './Exception/404',
      },
    ],
  },
];
