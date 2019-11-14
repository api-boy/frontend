import _ from 'lodash'
import Utils from '../utils.js'

export default {
  namespaced: true,

  state: {
    data: {},
    unsubscribeFuncs: {
      projectusers: null,
      projects: {}
    },
    current: {}
  },

  getters: {
    data (state) {
      return state.data
    },

    current (state) {
      return state.current
    }
  },

  mutations: {
    setProject (state, { id, project }) {
      Utils.setProp(state, ['data', id], project)
    },

    deleteProject (state, id) {
      Utils.deleteProp(state, ['data', id])
    },

    setUnsubscribeFunc (state, { unsubscribeFunc, id }) {
      if (id) {
        state.unsubscribeFuncs.projects[id] = unsubscribeFunc
      } else {
        state.unsubscribeFuncs.projectusers = unsubscribeFunc
      }
    },

    setCurrent (state, project) {
      state.current = project
    },

    clean (state) {
      state.data = {}
      state.unsubscribeFuncs.projectusers = null
      state.unsubscribeFuncs.projects = {}
      state.current = {}
    }
  },

  actions: {
    async init (ctx) {
      const currentUser = ctx.rootGetters['auth/currentUser']

      if (!currentUser) return

      // bind projectusers
      const unsubscribeFunc = Utils.firestore().collection('projectusers')
        .where('user_id', '==', currentUser.id)
        .onSnapshot((snapshot) => {
          snapshot.docChanges().forEach((change) => {
            const projectuser = change.doc.data()

            if (change.type === 'removed') {
              return ctx.dispatch('delProject', { id: projectuser.project_id })
            }

            ctx.dispatch('addProject', { id: projectuser.project_id })
          })
        })

      ctx.commit('setUnsubscribeFunc', { unsubscribeFunc })
    },

    async addProject (ctx, { id }) {
      // bind project
      const unsubscribeFunc = Utils.firestore().collection('projects')
        .where('id', '==', id)
        .onSnapshot((snapshot) => {
          snapshot.docChanges().forEach((change) => {
            const project = change.doc.data()

            if (change.type === 'removed' || project.deleted) {
              return ctx.dispatch('delProject', { id: project.id })
            }

            // generate random image id for project
            project.imageId = Utils.randomIntFromString(project.id)

            ctx.commit('setProject', { id: project.id, project })

            if (ctx.state.current && ctx.state.current.id === project.id) {
              ctx.commit('setCurrent', project)
            }
          })
        })

      ctx.commit('setUnsubscribeFunc', { unsubscribeFunc, id })
    },

    async delProject (ctx, { id }) {
      ctx.commit('deleteProject', id)
    },

    async create (ctx, { name }) {
      Utils.startLoading(ctx)

      try {
        await Utils.callApi(ctx, '/projects/create', { name }, true)
      } catch (err) {
        Utils.error(err, 'Could not create project, try again please.')
      }

      Utils.endLoading(ctx)
    },

    async rename (ctx, { id, name }) {
      Utils.startLoading(ctx)

      try {
        await Utils.callApi(ctx, '/projects/update', { id, name }, true)
      } catch (err) {
        Utils.error(err, 'Could not rename project, try again please.')
      }

      Utils.endLoading(ctx)
    },

    async confirmShare (ctx, { router, sharedByUserId, projectId }) {
      const currentUser = ctx.rootGetters['auth/currentUser']

      if (!currentUser) return

      Utils.startLoading(ctx)

      try {
        await Utils.callApi(ctx, '/projects-users/create', {
          project_id: projectId,
          shared_by_user_id: sharedByUserId
        }, true)

        Utils.msg('Project added to your workspace!')
        router.push({ name: 'dashboard' })
      } catch (err) {
        Utils.error(err, 'Could not get access to project, try again please.')
      }

      Utils.endLoading(ctx)
    },

    async delete (ctx, { router, id }) {
      const currentUser = ctx.rootGetters['auth/currentUser']

      if (!currentUser) return

      Utils.startLoading(ctx)

      try {
        await Utils.callApi(ctx, '/projects-users/delete', {
          project_id: id,
          user_id: currentUser.id
        }, true)

        router.push({ name: 'dashboard' })
      } catch (err) {
        Utils.error(err, 'Could not delete project, try again please.')
      }

      Utils.endLoading(ctx)
    },

    async setCurrent (ctx, { projectId }) {
      let project = {}

      if (projectId) {
        project.id = projectId

        if (ctx.state.data[projectId]) {
          project = ctx.state.data[projectId]
        }
      }

      ctx.commit('setCurrent', project)
    },

    async detach (ctx) {
      if (ctx.state.unsubscribeFuncs.projectusers) {
        ctx.state.unsubscribeFuncs.projectusers()
      }

      _.forOwn(ctx.state.unsubscribeFuncs.projects, (unsubscribeFunc) => {
        unsubscribeFunc()
      })
    },

    async clean (ctx) {
      ctx.commit('clean')
    }
  }
}
