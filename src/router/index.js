import Vue from 'vue';
import Router from 'vue-router';
import Home from '@/components/Home';
import Note from '@/components/Notes/Note';
import NoteList from '@/components/Notes/NoteList';
import NewNote from '@/components/Notes/NewNote';
import Login from '@/components/Auth/Login';
import Registration from '@/components/Auth/Registration';
import Orders from '@/components/User/Orders';
import AuthGuard from './auth-guard';

Vue.use(Router);

export default new Router({
  routes: [
    { path: '', name: 'home', component: Home },
    { path: '/note/:id', name: 'note', component: Note, props: true },
    { path: '/list', name: 'list', component: NoteList, beforeEnter: AuthGuard },
    { path: '/new', name: 'newNote', component: NewNote, beforeEnter: AuthGuard },
    { path: '/login', name: 'login', component: Login },
    { path: '/registration', name: 'registration', component: Registration },
    { path: '/orders', name: 'orders', component: Orders, beforeEnter: AuthGuard },
  ],
  mode: 'history',
});
