import Utils from '../utils.js'

export default {
  namespaced: true,

  state: {
    data: {},
    unsubscribeFunc: null,
    selectedId: null
  },

  getters: {
    data (state) {
      return state.data
    },

    selected (state) {
      if (!state.selectedId) return null
      return state.data[state.selectedId]
    }
  },

  mutations: {
    setEnvironment (state, { id, environment }) {
      Utils.setProp(state, ['data', id], environment)
    },

    deleteEnvironment (state, id) {
      Utils.deleteProp(state, ['data', id])
    },

    setUnsubscribeFunc (state, unsubscribeFunc) {
      state.unsubscribeFunc = unsubscribeFunc
    },

    setSelectedId (state, id) {
      state.selectedId = id
    },

    clean (state) {
      state.data = {}
      state.unsubscribeFunc = null
      state.selectedId = null
    }
  },

  actions: {
    async init (ctx, { projectId }) {
      // bind environments
      const unsubscribeFunc = Utils.firestore().collection('environments')
        .where('project_id', '==', projectId)
        .onSnapshot((snapshot) => {
          snapshot.docChanges().forEach((change) => {
            const id = change.doc.id
            const environment = change.doc.data()

            if (change.type === 'removed' || environment.deleted) {
              return ctx.commit('deleteEnvironment', id)
            }

            ctx.commit('setEnvironment', { id, environment })
          })
        })

      ctx.commit('setUnsubscribeFunc', unsubscribeFunc)
    },

    async create (ctx, { projectId, name, variables }) {
      let error = null

      Utils.startLoading(ctx)

      try {
        await Utils.callApi(ctx, '/environments/create', {
          project_id: projectId,
          name,
          variables
        }, true)
      } catch (err) {
        Utils.error(err, 'Could not create environment, try again please.')
        error = err
      }

      Utils.endLoading(ctx)

      return error
    },

    async update (ctx, { id, name, variables }) {
      let error = null

      Utils.startLoading(ctx)

      try {
        await Utils.callApi(ctx, '/environments/update', {
          id,
          name,
          variables
        }, true)
      } catch (err) {
        Utils.error(err, 'Could not update environment, try again please.')
        error = err
      }

      Utils.endLoading(ctx)

      return error
    },

    async delete (ctx, id) {
      Utils.startLoading(ctx)

      try {
        await Utils.callApi(ctx, '/environments/delete', { id }, true)
      } catch (err) {
        Utils.error(err, 'Could not delete environment, try again please.')
      }

      Utils.endLoading(ctx)
    },

    async duplicate (ctx, id) {
      Utils.startLoading(ctx)

      try {
        await Utils.callApi(ctx, '/environments/duplicate', { id }, true)
      } catch (err) {
        Utils.error(err, 'Could not duplicate environment, try again please.')
      }

      Utils.endLoading(ctx)
    },

    async select (ctx, id) {
      ctx.commit('setSelectedId', id)
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
