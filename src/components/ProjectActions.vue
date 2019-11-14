<template>
  <div class="is-pulled-right">
    <div class="columns">
      <div class="column action-column">
        <b-select v-model="selectedEnvironment">
          <option
            value="-1"
            selected
          >
            [No environment]
          </option>
          <option
            v-for="(env, ind) in environments"
            :key="ind"
            :value="env.id"
          >
            {{ env.name }}
          </option>
        </b-select>
      </div>
      <div class="column action-column">
        <div
          class="btn settings-btn"
          @click="manageEnvironments()"
        >
          <b-icon
            icon="settings"
            title="Manage environments"
          />
        </div>
      </div>
      <div class="column action-column">
        <b-button
          type="is-primary"
          @click="newFolder()"
        >
          New folder
        </b-button>
      </div>
      <div class="column action-column">
        <b-button
          type="is-primary"
          @click="newRequest()"
        >
          New request
        </b-button>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
  @import '../styles/variables';

  .action-column {
    padding-left: 0;
  }

  .settings-btn {
    display: inline-block;

    > span {
      color: $violet;
      margin-top: 6px;
      margin-right: 5px;
    }
  }
</style>

<script>
import _ from 'lodash'
import Utils from '../utils.js'
import Environments from './Environments.vue'

export default {
  name: 'ProjectActions',

  props: {
    project: {
      type: Object,
      default: null
    }
  },

  data () {
    return {
      selectedEnvironment: '-1',
      watchers: []
    }
  },

  computed: {
    environments () {
      return _.orderBy(this.$store.getters['environments/data'], 'name')
    }
  },

  created () {
    this.watchers.push(
      this.$watch(() => {
        return this.selectedEnvironment
      }, (id) => {
        let envId = id

        if (id === '-1') {
          envId = null
        }

        this.$store.dispatch('environments/select', envId)
      })
    )
  },

  destroyed () {
    this.watchers.forEach((unwatch) => {
      unwatch()
    })
  },

  methods: {
    newFolder () {
      this.$buefy.dialog.prompt({
        message: 'Create new folder',
        inputAttrs: {
          placeholder: 'Name'
        },
        onConfirm: (value) => {
          this.$store.dispatch('folders/create', {
            projectId: this.project.id,
            name: value
          })
        }
      })
    },

    newRequest () {
      const folderId = this.$store.getters['folders/opened']

      if (!folderId) {
        return Utils.msg('Please select a folder first.')
      }

      this.$buefy.dialog.prompt({
        message: 'Create new request',
        inputAttrs: {
          placeholder: 'Name'
        },
        onConfirm: (value) => {
          this.$store.dispatch('requests/create', {
            folderId,
            name: value
          })
        }
      })
    },

    manageEnvironments () {
      this.$buefy.modal.open({
        parent: this,
        component: Environments,
        hasModalCard: true,
        props: {
          project: this.project
        }
      })
    }
  }
}
</script>
