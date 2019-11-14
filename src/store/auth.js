import JWTDecode from 'jwt-decode'
import Utils from '../utils.js'

export default {
  namespaced: true,

  state: {
    jwt: '',
    route: null
  },

  getters: {
    jwt (state) {
      return state.jwt
    },

    currentUser (state) {
      if (!state.jwt) return null

      const jwtData = JWTDecode(state.jwt)

      return {
        id: jwtData.sub,
        name: jwtData.user_name,
        email: jwtData.user_email
      }
    }
  },

  mutations: {
    setJwt (state, jwt) {
      state.jwt = jwt
    },

    setRoute (state, route) {
      state.route = route
    },

    clean (state) {
      state.jwt = ''
      state.route = null
    }
  },

  actions: {
    async setRoute (ctx, route) {
      ctx.commit('setRoute', route)
    },

    async signup (ctx, { name, email, password, router }) {
      Utils.startLoading(ctx)

      try {
        // signup with the backend
        const response = await Utils.callApi(ctx, '/auth/signup', { name, email, password })

        ctx.commit('setJwt', response.data.jwt)
        ctx.dispatch('connectToFirebase', { router })
      } catch (err) {
        Utils.error(err, 'Could not create user. Probably because it already exists.')
      }

      Utils.endLoading(ctx)
    },

    async login (ctx, { email, password, router }) {
      Utils.startLoading(ctx)

      try {
        // login with the backend
        const response = await Utils.callApi(ctx, '/auth/login', { email, password })

        ctx.commit('setJwt', response.data.jwt)
        ctx.dispatch('connectToFirebase', { router })
      } catch (err) {
        Utils.error(err, 'Invalid email or password.')
      }

      Utils.endLoading(ctx)
    },

    async connectToFirebase (ctx, { router, route }) {
      Utils.startLoading(ctx)

      try {
        const response = await Utils.callApi(ctx, '/auth/get_firebase_credentials', {}, true)

        const firebaseCreds = {
          projectId: response.data.project_id,
          apiKey: response.data.api_key,
          accessToken: response.data.access_token
        }

        // login with firebase
        await Utils.firebaseLogin(firebaseCreds)
        Utils.firebase().goOnline()

        // initialize other stores
        ctx.dispatch('projects/init', null, { root: true })
        ctx.dispatch('user/init', null, { root: true })

        // go to the corresponding route page
        if (ctx.state.route && ctx.state.route.name !== 'not-found' &&
          ctx.state.route.name !== 'login' && ctx.state.route.name !== 'signup') {
          router.push({ name: ctx.state.route.name, params: ctx.state.route.params })
          ctx.commit('setRoute', null)
        } else if (!route || route.name === 'not-found' ||
          route.name === 'login' || route.name === 'signup') {
          router.push({ name: 'dashboard' })
        }

        ctx.dispatch('app/ready', null, { root: true })
      } catch (err) {
        Utils.error(err)

        // session probably expired.. clean stores and go the login page
        ctx.dispatch('clean')
        router.push({ name: 'login' })
      }

      Utils.endLoading(ctx)
    },

    async logout (ctx, { router }) {
      Utils.startLoading(ctx)

      try {
        Utils.firebase().goOffline()

        // detach other stores
        ctx.dispatch('folders/detach', null, { root: true })
        ctx.dispatch('projects/detach', null, { root: true })
        ctx.dispatch('user/detach', null, { root: true })

        // logout with firebase and the backend
        await Utils.firebaseLogout()
        await Utils.callApi(ctx, '/auth/logout', {}, true)

        // clean stores and go the login page
        ctx.dispatch('clean')
        router.push({ name: 'login' })
      } catch (err) {
        Utils.error(err, 'Could not logout, try again please.')
      }

      Utils.endLoading(ctx)
    },

    async clean (ctx) {
      ctx.commit('clean')

      // clean other stores
      ctx.dispatch('folders/clean', null, { root: true })
      ctx.dispatch('projects/clean', null, { root: true })
      ctx.dispatch('user/clean', null, { root: true })
    }
  }
}
