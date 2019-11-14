export default {
  namespaced: true,

  state: {
    totalRequests: 0
  },

  getters: {
    requests (state) {
      return state.totalRequests
    }
  },

  mutations: {
    incrementRequests (state) {
      state.totalRequests++
    },

    decrementRequests (state) {
      state.totalRequests--
    }
  },

  actions: {
    async start (ctx) {
      ctx.commit('incrementRequests')
    },

    async done (ctx) {
      ctx.commit('decrementRequests')
    }
  }
}
