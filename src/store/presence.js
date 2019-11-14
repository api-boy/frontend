import _ from 'lodash'
import UUID from 'uuid/v4'
import Utils from '../utils.js'

export default {
  namespaced: true,

  state: {
    userId: '',
    devices: {},
    others: {},
    presenceRef: null,
    projectRef: null,
    deviceRef: null,
    connectedRef: null
  },

  getters: {
    others (state) {
      return state.others
    }
  },

  mutations: {
    setUserId (state, userId) {
      state.userId = userId
    },

    setDevice (state, { id, user }) {
      Utils.setProp(state, ['devices', id], user)
    },

    deleteDevice (state, id) {
      Utils.deleteProp(state, ['devices', id])
    },

    updateOthers (state) {
      const others = {}

      _.forOwn(state.devices, (user) => {
        if (user.id !== state.userId && !others[user.id]) {
          others[user.id] = user
        }
      })

      state.others = others
    },

    setPresenceRef (state, presenceRef) {
      state.presenceRef = presenceRef
    },

    setProjectRef (state, projectRef) {
      state.projectRef = projectRef
    },

    setDeviceRef (state, deviceRef) {
      state.deviceRef = deviceRef
    },

    setConnectedRef (state, connectedRef) {
      state.connectedRef = connectedRef
    },

    clean (state) {
      state.userId = ''
      state.devices = {}
      state.others = {}
      state.presenceRef = null
      state.projectRef = null
      state.deviceRef = null
      state.connectedRef = null
    }
  },

  actions: {
    async init (ctx, { projectId }) {
      const currentUser = ctx.rootGetters['auth/currentUser']

      if (!currentUser) return

      const deviceId = UUID()
      const presenceRef = Utils.firebase().ref('presence')
      const projectRef = presenceRef.child(projectId)
      const deviceRef = projectRef.child(deviceId)
      const connectedRef = Utils.firebase().ref('.info/connected')

      ctx.commit('setUserId', currentUser.id)
      ctx.commit('setPresenceRef', presenceRef)
      ctx.commit('setProjectRef', projectRef)
      ctx.commit('setDeviceRef', deviceRef)
      ctx.commit('setConnectedRef', connectedRef)

      // bind connected state
      connectedRef.on('value', (snapshot) => {
        if (snapshot.val() === false) {
          return
        }

        // remove device when it disconnects
        deviceRef.onDisconnect().remove()

        // set device as connected
        deviceRef.set(currentUser)
      })

      // bind presence
      projectRef.on('child_added', (data) => {
        ctx.commit('setDevice', { id: data.key, user: data.val() })
        ctx.commit('updateOthers')
      })

      projectRef.on('child_changed', (data) => {
        ctx.commit('setDevice', { id: data.key, user: data.val() })
        ctx.commit('updateOthers')
      })

      projectRef.on('child_removed', (data) => {
        ctx.commit('deleteDevice', data.key)
        ctx.commit('updateOthers')
      })
    },

    async detach (ctx) {
      if (ctx.state.connectedRef) {
        ctx.state.connectedRef.off()
      }

      if (ctx.state.projectRef) {
        ctx.state.projectRef.off()
      }

      if (ctx.state.deviceRef) {
        ctx.state.deviceRef.onDisconnect().cancel()
        ctx.state.deviceRef.remove()
      }
    },

    async clean (ctx) {
      ctx.commit('clean')
    }
  }
}
