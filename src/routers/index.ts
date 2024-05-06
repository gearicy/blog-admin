import {  RouteRecordRaw, createRouter, createWebHistory } from 'vue-router'
import Login from '@/views/login.vue'
import Layout from '@/views/layout.vue'

const routes: RouteRecordRaw[] = [
    {
        path: '/login',
        name: 'login',
        component: Login
    },
    {
        path: '/',
        name: 'layout',
        component: Layout,
        redirect: 'article',
        children: [
            {
                path: 'article',
                name: 'article',
                component: () => import('@/views/article.vue')
            },
            {
                path: 'article/edit',
                name: 'articleEdit',
                component: () => import('@/views/article-edit.vue')
            },
            {
                path: 'comment',
                name: 'comment',
                component: () => import('@/views/comment.vue')
            },
            {
                path: 'link',
                name: 'link',
                component: () => import('@/views/link.vue')
            },
            {
                path: 'category',
                name: 'category',
                component: () => import('@/views/category.vue')
            },
            {
                path: 'reward',
                name: 'reward',
                component: () => import('@/views/reward.vue')
            },
            {
                path: 'visit',
                name: 'visit',
                component: () => import('@/views/visit.vue')
            },
            {
                path: 'account',
                name: 'account',
                component: () => import('@/views/account.vue')
            },
            {
                path: 'setting',
                name: 'setting',
                component: () => import('@/views/setting.vue')
            },
            {
                path: '404',
                name: '404',
                component: () => import('@/views/404.vue')
            }
        ]
    },
    {
        path: '/:pathMatch(.*)',
        redirect: { path: '/404' }
    }
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

export default router