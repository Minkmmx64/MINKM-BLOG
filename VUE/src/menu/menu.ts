
interface MenuData {
  /**
   * 菜单的名字
   */
  name: string,
  /**
   * 菜单的图标
   */
  icon: string,
  /**
   * 子级菜单
   */
  children: MenuChildData[]
}
/**
 * 子级菜单定义
 */
interface MenuChildData {
  /**
   * 菜单的名字
   */
  name: string,
  /**
   * 点击菜单跳转到的路由名称
   */
  route: string,

  /**
   * 子级菜单
   */
  children: MenuChildData[]
}

const menu = [
  {
    name: '首页',
    icon: 'ic_home_px',
    children: [
      {
        name: "仪表盘",
        route: "WellCome"
      }
    ]
  },
  {
    name: '文章管理',
    icon: 'ic_my_library_books_px',
    children: [
      {
        name: '写文章',
        route: 'ArticleCreated',
      },
      {
        name: '文章分类',
        route: 'ArticleCategories'
      },
      {
        name: '文章列表',
        route: 'ArticleList'
      },
      {
        name: '文章详情',
        route: 'ArticleDetails'
      },
      {
        name: '文章标签',
        route: 'ArticleLabel'
      },
      {
        name: '回收站',
        route: 'ArticleRecovery'
      }
    ]
  },
  {
    name: '用户详情',
    icon: 'ic_assignment_ind_px',
    children: [
      {
        name: '用户注册详情',
        route: 'UserInfo'
      },
      {
        name: "用户留言",
        route: "UserLeaveMsg"
      }
    ]
  },
  {
    name: '通用管理',
    icon: 'ic_settings_input_component_px',
    children: [
      {
        name: '网页分享',
        route: 'WebShare'
      },
      {
        name: '网页分类',
        route: 'WebCategories'
      },
      {
        name: '首页轮播图',
        route: 'WebBanner'
      },
      {
        name: '友情链接',
        route: 'FriendChain'
      }
    ]
  },
  {
    name: "WebChat",
    icon: 'ic_extension_px',
    children: [
      {
        name: '在线交流',
        route: 'ChatIndex',
      },
    ]
  },
  {
    name: "测试",
    icon: 'ic_insert_emoticon_px',
    children: [
      {
        name: "Test",
        route: "test"
      }
    ]
  }
] as MenuData[];


export default {
  menu: menu,
};