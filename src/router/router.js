import { createRouter, createWebHistory } from 'vue-router';

import LoginUser from '@/views/LoginUser.vue'
import RegisterUser from '@/views/RegisterUser.vue'
import UsersList from '@/views/UsersList.vue'
import UserChatPage from'@/views/UserChatPage.vue'

const routes = [
  { path: '/register', component: RegisterUser },
  { path: '/login', component: LoginUser },
  { path: '/users', component: UsersList },
  {
    path: '/user/:id',
    name: 'user',
    component: UserChatPage,
    props: true
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;

