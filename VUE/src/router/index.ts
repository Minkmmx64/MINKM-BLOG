import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";
import { message } from 'ant-design-vue';
import MainAdminTable from '@/views/Admin/Table/MainAdminTable.vue';
import ChatIndex from '@/views/Admin/Chat-manager/ChatIndex/ChatIndex.vue';
import ChatRoom from '@/views/Admin/Chat-manager/ChatRoom.vue';
import ChatSendMessage from '@/views/Admin/Chat-manager/ChatSendMessage.vue';
import ChatApply from '@/views/Admin/Chat-manager/ChatApply.vue';
import ChatUserInfo from '@/views/Admin/Chat-manager/ChatUserInfo.vue';
import WellCome from '@/views/Admin/WellCome/WellCome.vue';
import ArticleCreated from '@/views/Admin/Article-manager/ArticleCreated.vue';
const routes: Array<RouteRecordRaw> = [
    {
        path: "/",
        redirect: "/home",
    },
    {
        path: "/home",
        name: "home",
        component: () => import('@/views/Front/BlogIndexAssess/BlogIndex.vue')
    },
    {
        path: '/blogArticle/:id',
        name: 'blogArticle',
        component: () => import('@/views/Front/BlogArticleLists/BlogArticleOne.vue')
    },
    {
        path: '/NotFound',
        name: 'NotFound',
        component: () => import('@/views/NotFound.vue')
    },
    {
        path: "/admin",
        name: "admin",
        component: MainAdminTable,
        children: [
            {
                path: "/WellCome",
                name: "WellCome",
                component: WellCome
            },
            {
                path: "/ChatIndex",
                name: "ChatIndex",
                component: ChatIndex,
                children: [
                    {
                        path: '/ChatIndex',
                        name: 'ChatRoom',
                        component: ChatRoom,
                        children: [
                            {
                                path: '/ChatSendMessage',
                                name: 'ChatSendMessage',
                                component: ChatSendMessage
                            }
                        ]
                    }, {
                        path: '/ChatApply',
                        name: 'ChatApply',
                        component: ChatApply
                    }, {
                        path: '/ChatUserInfo',
                        name: 'ChatUserInfo',
                        component: ChatUserInfo
                    }
                ]
            },
            {
                path: '/ArticleCreated',
                name: 'ArticleCreated',
                component: ArticleCreated
            },
            {
                path: '/ArticleCategories',
                name: 'ArticleCategories',
                component: () => import('../views/Admin/Article-manager/ArticleCategories.vue')
            },
            {
                path: '/ArticleList',
                name: 'ArticleList',
                component: () => import('../views/Admin/Article-manager/ArticleList.vue')
            },
            {
                path: '/ArticleDetails',
                name: 'ArticleDetails',
                component: () => import('../views/Admin/Article-manager/ArticleDetails.vue')
            },
            {
                path: '/ArticleLabel',
                name: 'ArticleLabel',
                component: () => import('../views/Admin/Article-manager/ArticleLabel.vue')
            },
            {
                path: '/ArticleRecovery',
                name: 'ArticleRecovery',
                component: () => import('../views/Admin/Article-manager/ArticleRecovery.vue')
            },
            {
                path: '/UserInfo',
                name: 'UserInfo',
                component: () => import('../views/Admin/User-manager/UserInfo.vue')
            },
            {
                path: '/UserLeaveMsg',
                name: 'UserLeaveMsg',
                component: () => import("../views/Admin/User-manager/UserLeaveMsg.vue")
            },
            {
                path: '/WebShare',
                name: 'WebShare',
                component: () => import('../views/Admin/Comment-manager/WebShare.vue')
            }, 
            {
                path: '/WebCategories',
                name: 'WebCategories',
                component: () => import('../views/Admin/Comment-manager/WebCategories.vue')
            },
            {
                path: '/WebBanner',
                name: 'WebBanner',
                component: () => import('../views/Admin/Comment-manager/WebBanner.vue')
            },
            {
                path: '/test',
                name: 'test',
                component: () => import('../views/Test/TestTest.vue')
            },
            {
                path: '/FriendChain',
                name: "FriendChain",
                component: () => import('../views/Admin/Comment-manager/FriendChain.vue')
            }
        ],
    },
    {
        path: "/:catchAll(.*)",
        redirect: "/NotFound",
    },
];
const router = createRouter({
    history: createWebHistory(),
    routes,
});

/** 全局路由守卫 */
router.beforeEach((to, from, next) => {
    (to.name === 'home' || to.name === 'blogArticle')
        ?
        next()
        :
        sessionStorage.getItem("u_token") === null
            ?
            (next({ name: 'home' }), message.error('验证失败 This is an error message'))
            :
            next();
});

export default router;