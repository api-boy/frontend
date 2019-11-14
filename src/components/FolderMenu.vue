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
      @click="renameFolder(folder)"
    >
      Rename
    </b-dropdown-item>
    <b-dropdown-item
      aria-role="listitem"
      @click="deleteFolder(folder)"
    >
      Delete
    </b-dropdown-item>
  </b-dropdown>
</template>

<style lang="scss" scoped>
</style>

<script>
export default {
  name: 'FolderMenu',

  props: {
    folder: {
      type: Object,
      default: null
    }
  },

  methods: {
    renameFolder (folder) {
      this.$buefy.dialog.prompt({
        message: 'Rename folder',
        inputAttrs: {
          value: folder.name
        },
        onConfirm: (value) => {
          this.$store.dispatch('folders/rename', {
            id: folder.id,
            name: value
          })
        }
      })
    },

    deleteFolder (folder) {
      this.$buefy.dialog.confirm({
        message: `Are you sure you want to delete folder <b>${folder.name}</b>?`,
        confirmText: 'Delete',
        type: 'is-danger',
        onConfirm: () => {
          this.$store.dispatch('folders/delete', folder.id)
        }
      })
    }
  }
}
</script>
