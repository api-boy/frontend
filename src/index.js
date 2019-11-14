import Vue from 'vue'
import Vuex from 'vuex'
import VueRouter from 'vue-router'
import VuexPersistence from 'vuex-persist'
import Buefy from 'buefy'
import Clipboard from 'v-clipboard'

import 'buefy/dist/buefy.css'
import './styles/app.scss'

import AppStore from './store/app.js'
import AuthStore from './store/auth.js'
import FoldersStore from './store/folders.js'
import LoadingStore from './store/loading.js'
import PresenceStore from './store/presence.js'
import ProjectsStore from './store/projects.js'
import RequestsStore from './store/requests.js'
import EnvironmentsStore from './store/environments.js'
import UserStore from './store/user.js'

import App from './App.vue'
import Dashboard from './pages/Dashboard.vue'
import Login from './pages/Login.vue'
import Project from './pages/Project.vue'
import Signup from './pages/Signup.vue'
import Share from './pages/Share.vue'
import Profile from './pages/Profile.vue'

Vue.use(Vuex)
Vue.use(VueRouter)
Vue.use(Buefy)
Vue.use(Clipboard)

const persistence = new VuexPersistence({
  key: 'apiboy-' + process.env.ENV,
  storage: window.localStorage,
  modules: ['auth']
})

const store = new Vuex.Store({
  modules: {
    app: AppStore,
    auth: AuthStore,
    folders: FoldersStore,
    loading: LoadingStore,
    presence: PresenceStore,
    projects: ProjectsStore,
    requests: RequestsStore,
    environments: EnvironmentsStore,
    user: UserStore
  },
  plugins: [persistence.plugin]
})

const router = new VueRouter({
  mode: 'history',
  routes: [
    { name: 'dashboard', path: '/dashboard', component: Dashboard },
    { name: 'login', path: '/login', component: Login },
    { name: 'project', path: '/projects/:projectId', component: Project },
    { name: 'signup', path: '/signup', component: Signup },
    { name: 'share', path: '/share/:code', component: Share },
    { name: 'profile', path: '/profile', component: Profile },
    { name: 'not-found', path: '*' }
  ]
})

/* eslint-disable-next-line no-new */
new Vue({
  el: '#app',
  store,
  router,
  render: h => h(App)
})
