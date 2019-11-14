export default {
  namespaced: true,

  state: {
    ready: false
  },

  getters: {
    isReady (state) {
      return state.ready
    }
  },

  mutations: {
    setReady (state) {
      state.ready = true
    }
  },

  actions: {
    async ready (ctx) {
      ctx.commit('setReady')
    }
  }
}
