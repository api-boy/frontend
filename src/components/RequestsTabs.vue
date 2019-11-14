<template>
  <div v-show="openedRequests.length > 0">
    <b-tabs
      v-model="activeTab"
      type="is-boxed"
      :animated="false"
    >
      <b-tab-item
        v-for="(request) in openedRequests"
        :id="request.id"
        :key="request.id"
        :label="request.name"
      >
        <template slot="header">
          <div
            class="tab-header"
            :title="fullName(request)"
          >
            {{ request.name }}
          </div>
          <div
            class="tab-header close-btn"
            @click.stop="closeRequest(request.id)"
          >
            <b-icon
              icon="close"
              size="is-small"
            />
          </div>
        </template>
        <Request :request="request" />
      </b-tab-item>
    </b-tabs>
  </div>
</template>

<style lang="scss" scoped>
  @import '../styles/variables';

  .tab-header {
    display: inline-block;

    .icon {
      margin-right: 0;
      margin-left: 0;
    }

    .icon:hover {
      background-color: $violet;
      color: $white;
    }
  }

  .close-btn {
    margin-left: 20px;
  }
</style>

<script>
import _ from 'lodash'
import Request from './Request.vue'

export default {
  name: 'RequestsTabs',

  components: {
    Request
  },

  data () {
    return {
      activeTab: 0,
      watchers: []
    }
  },

  computed: {
    openedRequests () {
      return this.$store.getters['requests/opened']
    },

    fullName () {
      return (request) => {
        const folder = this.$store.getters['folders/get'](request.folder_id)
        return folder ? (folder.name + '/' + request.name) : request.name
      }
    }
  },

  created () {
    this.watchers.push(
      this.$watch(() => {
        return this.$store.getters['folders/selectedRequest']
      }, (id) => {
        setTimeout(() => {
          const ind = _.findIndex(this.openedRequests, (req) => {
            return req.id === id
          })
          if (ind >= 0) {
            this.activeTab = ind
          }
        }, 100)
      })
    )
  },

  destroyed () {
    this.watchers.forEach((unwatch) => {
      unwatch()
    })
  },

  methods: {
    selectRequest (id) {
      this.$store.dispatch('requests/setCurrent', id)
    },

    closeRequest (id) {
      const ind = _.findIndex(this.openedRequests, (req) => {
        return req.id === id
      })

      let active = -1

      if (ind === this.activeTab) {
        // closing the opened request -> activate the first tab
        if (this.openedRequests.length > 1) {
          active = 0
        }
      } else if (ind < this.activeTab) {
        // closing the opened request -> activate the first tab
        if (this.openedRequests.length > 1) {
          active = this.activeTab - 1
        }
      }

      this.$store.dispatch('requests/close', id)

      if (active >= 0) {
        setTimeout(() => {
          this.activeTab = active
        }, 100)
      }
    }
  }
}
</script>
