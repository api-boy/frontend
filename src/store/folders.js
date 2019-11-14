import Utils from '../utils.js'

export default {
  namespaced: true,

  state: {
    data: {},
    tmpdata: {},
    openedFolderId: null,
    selectedRequestId: null,
    unsubscribeFunc: null
  },

  getters: {
    data (state) {
      return state.data
    },

    opened (state) {
      return state.openedFolderId
    },

    selectedRequest (state) {
      return state.selectedRequestId
    },

    get (state) {
      return (folderId) => {
        return state.data[folderId]
      }
    }
  },

  mutations: {
    setFolder (state, { id, folder }) {
      if (state.tmpdata[id]) {
        folder.requests = state.tmpdata[id].requests
        Utils.deleteProp(state, ['tmpdata', id])
      }

      Utils.setProp(state, ['data', id], folder)

      if (!state.openedFolderId) {
        Utils.setProp(state, ['openedFolderId'], id)
      }
    },

    deleteFolder (state, id) {
      if (state.data[id]) {
        Utils.deleteProp(state, ['data', id])
      }
    },

    openFolder (state, id) {
      Utils.setProp(state, ['openedFolderId'], id)
    },

    setRequest (state, { id, name, folderId }) {
      if (state.data[folderId]) {
        Utils.setProp(state, ['data', folderId, 'requests', id], { id, name })
      } else {
        Utils.setProp(state, ['tmpdata', folderId, 'requests', id], { id, name })
      }
    },

    deleteRequest (state, { id, folderId }) {
      Utils.deleteProp(state, ['data', folderId, 'requests', id])
    },

    selectRequest (state, id) {
      Utils.setProp(state, ['selectedRequestId'], id)
    },

    setUnsubscribeFunc (state, unsubscribeFunc) {
      state.unsubscribeFunc = unsubscribeFunc
    },

    clean (state) {
      state.data = {}
      state.openedFolderId = null
      state.selectedRequestId = null
      state.unsubscribeFunc = null
    }
  },

  actions: {
    async init (ctx, { projectId }) {
      // bind folders
      const unsubscribeFunc = Utils.firestore().collection('folders')
        .where('project_id', '==', projectId)
        .onSnapshot((snapshot) => {
          snapshot.docChanges().forEach((change) => {
            const id = change.doc.id
            const folder = change.doc.data()

            if (change.type === 'removed' || folder.deleted) {
              return ctx.commit('deleteFolder', id)
            }

            ctx.commit('setFolder', { id, folder })
          })
        })

      ctx.commit('setUnsubscribeFunc', unsubscribeFunc)
    },

    async create (ctx, { projectId, name }) {
      Utils.startLoading(ctx)

      try {
        await Utils.callApi(ctx, '/folders/create', {
          project_id: projectId,
          name
        }, true)
      } catch (err) {
        Utils.error(err, 'Could not create folder, try again please.')
      }

      Utils.endLoading(ctx)
    },

    async rename (ctx, { id, name }) {
      Utils.startLoading(ctx)

      try {
        await Utils.callApi(ctx, '/folders/update', { id, name }, true)
      } catch (err) {
        Utils.error(err, 'Could not rename folder, try again please.')
      }

      Utils.endLoading(ctx)
    },

    async delete (ctx, id) {
      Utils.startLoading(ctx)

      try {
        await Utils.callApi(ctx, '/folders/delete', { id }, true)
      } catch (err) {
        Utils.error(err, 'Could not delete folder, try again please.')
      }

      Utils.endLoading(ctx)
    },

    async open (ctx, id) {
      ctx.commit('openFolder', id)
    },

    async setRequest (ctx, { id, name, folderId }) {
      ctx.commit('setRequest', { id, name, folderId })
    },

    async deleteRequest (ctx, { id, folderId }) {
      ctx.commit('deleteRequest', { id, folderId })
    },

    async selectRequest (ctx, id) {
      ctx.commit('selectRequest', id)
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
