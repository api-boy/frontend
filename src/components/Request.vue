<template>
  <div v-if="updRequest">
    <div class="columns is-multiline">
      <div class="column is-narrow">
        <b-field>
          <b-select
            v-model="updRequest.type"
          >
            <option
              v-for="item in methods"
              :key="item"
              :value="item"
            >
              {{ item }}
            </option>
          </b-select>
        </b-field>
      </div>
      <div class="column">
        <b-field>
          <b-input
            v-model="updRequest.url"
            type="text"
            placeholder="Url"
          />
        </b-field>
      </div>
      <div class="column is-narrow">
        <b-button
          type="is-primary"
          :loading="loading"
          @click="sendRequest()"
        >
          Send
        </b-button>
      </div>
      <div class="column is-narrow">
        <b-button
          type="is-danger"
          :disabled="notChanged"
          @click="updateRequest()"
        >
          Save
        </b-button>
      </div>
    </div>
    <div class="columns">
      <div class="column">
        <div class="columns">
          <div class="column">
            <b-collapse
              class="card"
              aria-id="request-headers"
              :open="false"
            >
              <div
                slot="trigger"
                slot-scope="props"
                class="card-header"
                role="button"
                aria-controls="request-headers"
              >
                <p class="card-header-title">
                  Request Headers
                </p>
                <a class="card-header-icon">
                  <b-icon
                    :icon="props.open ? 'menu-down' : 'menu-up'"
                  />
                </a>
              </div>
              <div class="card-content">
                <div class="content">
                  <RequestHeaders v-model="updRequest.headers" />
                </div>
              </div>
            </b-collapse>
          </div>
        </div>
        <div class="columns">
          <div class="column">
            <b-collapse
              class="card"
              aria-id="request-body"
            >
              <div
                slot="trigger"
                slot-scope="props"
                class="card-header"
                role="button"
                aria-controls="request-body"
              >
                <p class="card-header-title">
                  Request Body
                </p>
                <a class="card-header-icon">
                  <b-icon
                    :icon="props.open ? 'menu-down' : 'menu-up'"
                  />
                </a>
              </div>
              <div class="card-content">
                <div class="content">
                  <b-input
                    v-model="updRequest.body"
                    type="textarea"
                    rows="10"
                    custom-class="textarea-code"
                  />
                </div>
              </div>
            </b-collapse>
          </div>
        </div>
      </div>
      <div class="column">
        <div class="columns is-multiline">
          <div class="column is-narrow is-left">
            Code:
            &nbsp;
            <b-tag
              :type="lastResponse.class"
              size="is-medium"
              rounded
            >
              {{ lastResponse.status }}
            </b-tag>
          </div>
          <div class="column is-narrow is-left">
            Time:
            &nbsp;
            <b-tag
              type="is-warning"
              size="is-medium"
              rounded
            >
              {{ lastResponse.time }}
            </b-tag>
          </div>
          <div class="column is-narrow is-left">
            Size:
            &nbsp;
            <b-tag
              type="is-warning"
              size="is-medium"
              rounded
            >
              {{ lastResponse.size }}
            </b-tag>
          </div>
        </div>
        <div class="columns">
          <div class="column">
            <b-collapse
              class="card"
              aria-id="response-headers"
              :open="false"
            >
              <div
                slot="trigger"
                slot-scope="props"
                class="card-header"
                role="button"
                aria-controls="response-headers"
              >
                <p class="card-header-title">
                  Response Headers
                </p>
                <a class="card-header-icon">
                  <b-icon
                    :icon="props.open ? 'menu-down' : 'menu-up'"
                  />
                </a>
              </div>
              <div class="card-content">
                <div class="content">
                  <ResponseHeaders v-model="lastResponse.headers" />
                </div>
              </div>
            </b-collapse>
          </div>
        </div>
        <div class="columns">
          <div class="column">
            <b-collapse
              class="card"
              aria-id="response-body"
            >
              <div
                slot="trigger"
                slot-scope="props"
                class="card-header"
                role="button"
                aria-controls="response-body"
              >
                <p class="card-header-title">
                  Response Body
                </p>
                <a class="card-header-icon">
                  <b-icon
                    :icon="props.open ? 'menu-down' : 'menu-up'"
                  />
                </a>
              </div>
              <div class="card-content">
                <div class="content">
                  <pre class="content-body">{{ lastResponse.body }}</pre>
                </div>
              </div>
            </b-collapse>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
  .content-body {
    white-space: pre-wrap;
    word-break: break-all;
  }

  .tag {
    min-width: 80px;
  }
</style>

<script>
import _ from 'lodash'
import RequestHeaders from './RequestHeaders.vue'
import ResponseHeaders from './ResponseHeaders.vue'
import Utils from '../utils.js'

export default {
  name: 'Request',

  components: {
    RequestHeaders,
    ResponseHeaders
  },

  props: {
    request: {
      type: Object,
      default: null
    }
  },

  data () {
    return {
      updRequest: null,
      methods: ['POST', 'GET', 'PUT', 'PATCH', 'DELETE', 'HEAD', 'OPTIONS'],
      switchValue: 'Local',
      notChanged: true,
      loading: false,
      lastResponse: this.newResponse(),
      watchers: []
    }
  },

  created () {
    this.updRequest = _.cloneDeep(this.request)

    this.watchers.push(
      this.$watch(() => {
        return this.updRequest
      }, (updRequest) => {
        // compare the updated request with the one that was opened
        this.notChanged = Utils.equalRequests(this.request, updRequest)
      }, {
        deep: true
      })
    )

    this.watchers.push(
      this.$watch(() => {
        return this.request
      }, (request) => {
        // compare the updated request with the one that was opened
        this.notChanged = Utils.equalRequests(request, this.updRequest)
      }, {
        deep: true
      })
    )
  },

  destroyed () {
    this.watchers.forEach((unwatch) => {
      unwatch()
    })
  },

  methods: {
    newResponse () {
      return {
        class: 'is-warning',
        status: '-',
        time: '0 ms',
        size: '0 bytes',
        headers: {},
        body: ''
      }
    },

    updateRequest () {
      // compare opened request with the one in the store
      const req = this.$store.getters['requests/data'][this.request.id]

      if (req) {
        const equals = Utils.equalRequests(this.request, req)

        if (equals) {
          // if they are equal, means that nobody else updated it
          // so we are safe to update it with our version
          return this.$store.dispatch('requests/update', this.updRequest)
        }

        this.$buefy.dialog.confirm({
          message: 'Someone else updated this request. Do you want to override it?',
          confirmText: 'Override',
          type: 'is-danger',
          hasIcon: true,
          onConfirm: () => {
            this.$store.dispatch('requests/update', this.updRequest)
          }
        })
      }
    },

    async sendRequest () {
      this.loading = true
      this.lastResponse = this.newResponse()

      const req = _.cloneDeep(this.updRequest)
      const env = this.$store.getters['environments/selected']
      const resp = await Utils.sendRequest(req, env, true)

      if (resp.status === 200) {
        this.lastResponse.class = 'is-success'

        if (!resp.statusText) {
          resp.statusText = 'OK'
        }
      } else {
        this.lastResponse.class = 'is-danger'
      }

      this.lastResponse.status = resp.status ? (resp.status + ' ' + resp.statusText) : resp.statusText
      this.lastResponse.time = resp.time + ' ms'
      this.lastResponse.size = resp.size + ' bytes'
      this.lastResponse.headers = resp.headers
      this.lastResponse.body = resp.body
      this.loading = false
    }
  }
}
</script>
