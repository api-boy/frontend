import Utils from '../utils.js'

export default {
  namespaced: true,

  state: {
    data: {},
    unsubscribeFunc: null
  },

  getters: {
    data (state) {
      return state.data
    }
  },

  mutations: {
    setData (state, data) {
      state.data = data
    },

    setUnsubscribeFunc (state, unsubscribeFunc) {
      state.unsubscribeFunc = unsubscribeFunc
    },

    clean (state) {
      state.data = {}
      state.unsubscribeFunc = null
    }
  },

  actions: {
    async init (ctx) {
      const currentUser = ctx.rootGetters['auth/currentUser']

      if (!currentUser) return

      // bind user
      const unsubscribeFunc = Utils.firestore().collection('users')
        .doc(currentUser.id)
        .onSnapshot((snapshot) => {
          ctx.commit('setData', snapshot.data())
        })

      ctx.commit('setUnsubscribeFunc', unsubscribeFunc)
    },

    async update (ctx, { id, name, email, password }) {
      Utils.startLoading(ctx)

      try {
        await Utils.callApi(ctx, '/users/update', { id, name, email, password }, true)
      } catch (err) {
        Utils.error(err, 'Could not update user. Probably because it already exists.')
      }

      Utils.endLoading(ctx)
    },

    async detach (ctx) {
      if (ctx.state.unsubscribeFunc) {
        ctx.state.unsubscribeFunc()
      }
    },

    async clean (ctx) {
      ctx.commit('clean')
    }
  }
}
