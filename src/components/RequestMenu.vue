<template>
  <b-dropdown
    aria-role="list"
    class="is-pulled-right is-right"
    hoverable
  >
    <b-icon
      slot="trigger"
      icon="dots-vertical"
    />
    <b-dropdown-item
      aria-role="listitem"
      @click="renameRequest(request)"
    >
      Rename
    </b-dropdown-item>
    <b-dropdown-item
      aria-role="listitem"
      @click="duplicateRequest(request)"
    >
      Duplicate
    </b-dropdown-item>
    <b-dropdown-item
      aria-role="listitem"
      @click="deleteRequest(request)"
    >
      Delete
    </b-dropdown-item>
  </b-dropdown>
</template>

<style lang="scss" scoped>
</style>

<script>
export default {
  name: 'RequestMenu',

  props: {
    request: {
      type: Object,
      default: null
    }
  },

  methods: {
    renameRequest (request) {
      this.$buefy.dialog.prompt({
        message: 'Rename request',
        inputAttrs: {
          value: request.name
        },
        onConfirm: (value) => {
          this.$store.dispatch('requests/rename', {
            id: request.id,
            name: value
          })
        }
      })
    },

    deleteRequest (request) {
      this.$buefy.dialog.confirm({
        message: `Are you sure you want to delete request <b>${request.name}</b>?`,
        confirmText: 'Delete',
        type: 'is-danger',
        onConfirm: () => {
          this.$store.dispatch('requests/delete', request.id)
        }
      })
    },

    duplicateRequest (request) {
      this.$store.dispatch('requests/duplicate', request.id)
    }
  }
}
</script>
