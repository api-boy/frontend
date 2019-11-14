<template>
  <div class="modal-content">
    <div class="box environments-box">
      <!-- ENVIRONMENTS TITLE -->
      <div
        v-show="updEnvironment === null"
        class="columns"
      >
        <div class="column">
          <div class="title-wrapper">
            <h5 class="subtitle is-5">
              Environments:
            </h5>
          </div>
        </div>
        <div class="column is-narrow">
          <b-button
            type="is-primary"
            @click="newEnvironment()"
          >
            New environment
          </b-button>
        </div>
      </div>
      <!-- ENVIRONMENTS LIST -->
      <div
        v-for="(env, ind) in environments"
        v-show="updEnvironment === null"
        :key="ind"
        class="columns env-row"
      >
        <div class="column">
          <hr>
          <div class="columns">
            <div
              class="column btn env-btn"
              @click="updateEnvironment(env)"
            >
              {{ env.name }}
            </div>
            <div
              class="column is-narrow"
            >
              <b-dropdown
                class="is-right env-menu"
                aria-role="list"
                hoverable
              >
                <b-icon
                  slot="trigger"
                  icon="dots-vertical"
                />
                <b-dropdown-item
                  aria-role="listitem"
                  @click="duplicateEnvironment(env)"
                >
                  Duplicate
                </b-dropdown-item>
                <b-dropdown-item
                  aria-role="listitem"
                  @click="deleteEnvironment(env)"
                >
                  Delete
                </b-dropdown-item>
              </b-dropdown>
            </div>
          </div>
        </div>
      </div>
      <!-- ENVIRONMENT NAME -->
      <div
        v-if="updEnvironment !== null"
        class="columns"
      >
        <div class="column is-narrow">
          <div
            class="btn back-btn"
            @click="backToEnvironments()"
          >
            <b-icon
              icon="arrow-left"
              type="is-primary"
            />
          </div>
        </div>
        <div class="column">
          <b-input
            v-model="updEnvironment.name"
            placeholder="Environment name"
          />
        </div>
        <div class="column is-narrow">
          <div class="is-pulled-right">
            <b-button
              type="is-primary"
              :loading="loading"
              @click="saveEnvironment()"
            >
              Save
            </b-button>
          </div>
        </div>
      </div>
      <!-- ENVIRONMENT VARIABLES -->
      <div
        v-if="updEnvironment !== null"
        class="columns"
      >
        <div class="column">
          Variables:
          <b-tooltip
            :label="helpMsg"
            position="is-right"
            size="is-small"
            multilined
          >
            <b-icon
              icon="help-circle"
              size="is-small"
              type="is-primary"
              class="help-icon"
            />
          </b-tooltip>
          <table class="table is-fullwidth variables-table">
            <tbody>
              <tr
                v-for="(v, ind) in updEnvironment.variables"
                :key="ind"
              >
                <td class="variables-column-no-padding">
                  <input
                    v-model="v.key"
                    class="input"
                    type="text"
                    placeholder="Key"
                  >
                </td>
                <td>
                  <input
                    v-model="v.val"
                    class="input"
                    type="text"
                    placeholder="Value"
                  >
                </td>
                <td class="variables-column-no-padding">
                  <div
                    class="btn delete-btn"
                    @click.stop="deleteVariable(ind)"
                  >
                    <b-icon
                      icon="close"
                      size="is-small"
                      type="is-primary"
                    />
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
          <span
            class="btn add-btn"
            @click="newVariable()"
          >
            Add variable
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
  @import '../styles/variables';

  .environments-box {
    width: 500px;
    min-height: 400px;
    max-width: 100%;
  }

  .title-wrapper {
    position: relative;
    top: 5px;
  }

  .env-row {
    margin-bottom: 0;
  }

  hr {
    margin-top: 0;
    margin-bottom: 10px;
  }

  .env-btn:hover {
    color: $violet;
    text-decoration: underline;
  }

  .env-menu:hover {
    .icon {
      color: $black !important;
      background-color: transparent !important;
    }
  }

  .back-btn {
    margin-top: 5px;
  }

  .icon:hover {
    background-color: $violet;
    color: $white !important;
  }

  .add-btn {
    color: $violet;
    font-size: 10pt;
    margin-left: 3px;
  }

  .add-btn:hover {
    text-decoration: underline;
  }

  .delete-btn {
    margin-top: 6px;
  }

  .variables-table {
    margin-bottom: 0 !important;
  }

  .variables-column-no-padding {
    padding-left: 0 !important;
    padding-right: 0 !important;
  }

  .content table tbody tr:first-child td {
    padding-top: 0 !important;
  }

  .help-icon:hover {
    color: $violet !important;
    background-color: transparent !important;
  }
</style>

<script>
import _ from 'lodash'

export default {
  name: 'Environments',

  props: {
    project: {
      type: Object,
      default: null
    }
  },

  data () {
    return {
      updEnvironment: null,
      loading: false,
      helpMsg: 'Variables can be used as {{variable-key}} in the requests\' URL, headers and body.'
    }
  },

  computed: {
    environments () {
      return _.orderBy(this.$store.getters['environments/data'], 'name')
    }
  },

  methods: {
    newEnvironment () {
      this.updEnvironment = {
        name: '',
        variables: [{
          key: '',
          val: ''
        }]
      }
    },

    backToEnvironments () {
      this.updEnvironment = null
    },

    updateEnvironment (env) {
      const vars = []

      _.forOwn(env.variables, (val, key) => {
        vars.push({ key, val })
      })

      if (vars.length === 0) {
        vars.push({
          key: '',
          val: ''
        })
      }

      this.updEnvironment = {
        id: env.id,
        name: env.name,
        variables: vars
      }
    },

    deleteEnvironment (env) {
      this.$store.dispatch('environments/delete', env.id)
    },

    duplicateEnvironment (env) {
      this.$store.dispatch('environments/duplicate', env.id)
    },

    newVariable () {
      this.updEnvironment.variables.push({
        key: '',
        val: ''
      })
    },

    deleteVariable (ind) {
      this.updEnvironment.variables.splice(ind, 1)
    },

    async saveEnvironment () {
      this.loading = true
      const vars = {}

      this.updEnvironment.variables.forEach((v) => {
        if (v.key.trim() !== '') {
          vars[v.key.trim()] = v.val
        }
      })

      let action = 'environments/create'

      const params = {
        name: this.updEnvironment.name,
        variables: vars
      }

      if (this.updEnvironment.id) {
        action = 'environments/update'
        params.id = this.updEnvironment.id
      } else {
        params.projectId = this.project.id
      }

      const err = await this.$store.dispatch(action, params)

      if (err === null) {
        this.updEnvironment = null
      }

      this.loading = false
    }
  }
}
</script>
