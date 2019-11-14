<template>
  <div>
    <table class="table is-fullwidth headers-table">
      <tbody>
        <tr
          v-for="(header, ind) in headers"
          :key="ind"
        >
          <td class="headers-column-no-padding">
            <input
              v-model="header.key"
              class="input"
              type="text"
              placeholder="Key"
            >
          </td>
          <td>
            <input
              v-model="header.val"
              class="input"
              type="text"
              placeholder="Value"
            >
          </td>
          <td class="headers-column-no-padding">
            <div
              class="btn delete-btn"
              @click.stop="deleteHeader(ind)"
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
      @click="newHeader()"
    >
      Add header
    </span>
  </div>
</template>

<style lang="scss" scoped>
  @import '../styles/variables';

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

  .headers-table {
    margin-bottom: 0 !important;
  }

  .headers-column-no-padding {
    padding-left: 0 !important;
    padding-right: 0 !important;
  }

  .content table tbody tr:first-child td {
    padding-top: 0 !important;
  }
</style>

<script>
import _ from 'lodash'

export default {
  name: 'RequestHeaders',

  props: {
    value: {
      type: Object,
      default: null
    }
  },

  data () {
    return {
      headers: [],
      watchers: []
    }
  },

  created () {
    _.forOwn(this.value, (val, key) => {
      this.headers.push({ key, val })
    })

    this.watchers.push(
      this.$watch(() => {
        return this.headers
      }, (newHeaders) => {
        const newValue = {}

        newHeaders.forEach((header) => {
          if (header.key.trim() !== '') {
            newValue[header.key.trim()] = header.val
          }
        })

        this.$emit('input', newValue)
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
    newHeader () {
      this.headers.push({
        key: '',
        val: ''
      })
    },

    deleteHeader (ind) {
      this.headers.splice(ind, 1)
    }
  }
}
</script>
