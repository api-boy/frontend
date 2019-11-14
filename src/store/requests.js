import _ from 'lodash'
import Utils from '../utils.js'

export default {
  namespaced: true,

  state: {
    data: {},
    unsubscribeFunc: null,
    openedRequests: []
  },

  getters: {
    data (state) {
      return state.data
    },

    opened (state) {
      return state.openedRequests
    }
  },

  mutations: {
    setRequest (state, { id, request }) {
      Utils.setProp(state, ['data', id], request)

      state.openedRequests.forEach((req) => {
        if (req.id === id) {
          req.name = request.name
        }
      })
    },

    deleteRequest (state, id) {
      Utils.deleteProp(state, ['data', id])
    },

    openRequest (state, id) {
      const found = _.find(state.openedRequests, (req) => {
        return req.id === id
      })

      if (!found) {
        const request = _.cloneDeep(state.data[id])
        state.openedRequests.push(request)
      }
    },

    closeRequest (state, id) {
      state.openedRequests = _.filter(state.openedRequests, (req) => {
        return req.id !== id
      })
    },

    updateOpenedRequest (state, { id, type, url, headers, body }) {
      state.openedRequests.forEach((req) => {
        if (req.id === id) {
          req.type = type
          req.url = url
          req.headers = headers
          req.body = body
        }
      })
    },

    setUnsubscribeFunc (state, unsubscribeFunc) {
      state.unsubscribeFunc = unsubscribeFunc
    },

    clean (state) {
      state.data = {}
      state.unsubscribeFunc = null
      state.openedRequests = []
    }
  },

  actions: {
    async init (ctx, { projectId }) {
      // bind requests
      const unsubscribeFunc = Utils.firestore().collection('requests')
        .where('project_id', '==', projectId)
        .onSnapshot((snapshot) => {
          snapshot.docChanges().forEach((change) => {
            const id = change.doc.id
            const request = change.doc.data()
            const folderId = request.folder_id
            const oldFolderId = ctx.state.data[id] ? ctx.state.data[id].folder_id : null

            if (change.type === 'removed' || request.deleted) {
              ctx.commit('deleteRequest', id)
              return ctx.dispatch('folders/deleteRequest', { id, folderId }, { root: true })
            }

            ctx.commit('setRequest', { id, request })

            if (oldFolderId && oldFolderId !== folderId) {
              ctx.dispatch('folders/deleteRequest', { id, folderId: oldFolderId }, { root: true })
            }

            ctx.dispatch('folders/setRequest', { id, name: request.name, folderId }, { root: true })
          })
        })

      ctx.commit('setUnsubscribeFunc', unsubscribeFunc)
    },

    async create (ctx, { folderId, name }) {
      Utils.startLoading(ctx)

      try {
        await Utils.callApi(ctx, '/requests/create', {
          folder_id: folderId,
          type: 'POST',
          name
        }, true)
      } catch (err) {
        Utils.error(err, 'Could not create request, try again please.')
      }

      Utils.endLoading(ctx)
    },

    async rename (ctx, { id, name }) {
      Utils.startLoading(ctx)

      try {
        const req = ctx.state.data[id]

        await Utils.callApi(ctx, '/requests/update', {
          id,
          name,
          folder_id: req.folder_id,
          type: req.type,
          url: req.url,
          headers: req.headers,
          body: req.body
        }, true)
      } catch (err) {
        Utils.error(err, 'Could not rename request, try again please.')
      }

      Utils.endLoading(ctx)
    },

    async update (ctx, { id, type, url, headers, body }) {
      Utils.startLoading(ctx)

      try {
        const req = ctx.state.data[id]

        await Utils.callApi(ctx, '/requests/update', {
          id,
          name: req.name,
          folder_id: req.folder_id,
          type,
          url,
          headers,
          body
        }, true)

        ctx.commit('updateOpenedRequest', { id, type, url, headers, body })
      } catch (err) {
        Utils.error(err, 'Could not update request, try again please.')
      }

      Utils.endLoading(ctx)
    },

    async move (ctx, { id, toFolderId }) {
      Utils.startLoading(ctx)

      try {
        const req = ctx.state.data[id]

        if (req.folder_id !== toFolderId) {
          await Utils.callApi(ctx, '/requests/update', {
            id,
            name: req.name,
            folder_id: toFolderId,
            type: req.type,
            url: req.url,
            headers: req.headers,
            body: req.body
          }, true)
        }
      } catch (err) {
        Utils.error(err, 'Could not move request, try again please.')
      }

      Utils.endLoading(ctx)
    },

    async delete (ctx, id) {
      Utils.startLoading(ctx)

      try {
        await Utils.callApi(ctx, '/requests/delete', { id }, true)
        ctx.commit('closeRequest', id)
      } catch (err) {
        Utils.error(err, 'Could not delete request, try again please.')
      }

      Utils.endLoading(ctx)
    },

    async duplicate (ctx, id) {
      Utils.startLoading(ctx)

      try {
        await Utils.callApi(ctx, '/requests/duplicate', { id }, true)
      } catch (err) {
        Utils.error(err, 'Could not duplicate request, try again please.')
      }

      Utils.endLoading(ctx)
    },

    async open (ctx, id) {
      ctx.commit('openRequest', id)
    },

    async setCurrent (ctx, id) {
      ctx.commit('setCurrentRequest', id)
    },

    async close (ctx, id) {
      ctx.commit('closeRequest', id)
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
