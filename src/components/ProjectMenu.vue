<template>
  <b-dropdown
    class="is-right project-menu"
    aria-role="list"
    hoverable
  >
    <b-icon
      slot="trigger"
      icon="dots-vertical"
    />
    <b-dropdown-item
      aria-role="listitem"
      @click="renameProject(project)"
    >
      Rename
    </b-dropdown-item>
    <b-dropdown-item
      aria-role="listitem"
      @click="shareProject(project)"
    >
      Share
    </b-dropdown-item>
    <b-dropdown-item
      aria-role="listitem"
      @click="deleteProject(project)"
    >
      Delete
    </b-dropdown-item>
  </b-dropdown>
</template>

<style lang="scss" scoped>
  .project-menu {
    margin-top: 30px;
  }
</style>

<script>
import ProjectShare from './ProjectShare.vue'

export default {
  name: 'ProjectMenu',

  props: {
    project: {
      type: Object,
      default: null
    }
  },

  methods: {
    renameProject (project) {
      this.$buefy.dialog.prompt({
        message: 'Rename project',
        inputAttrs: {
          value: project.name
        },
        onConfirm: (value) => {
          this.$store.dispatch('projects/rename', {
            id: project.id,
            name: value
          })
        }
      })
    },

    shareProject (project) {
      this.$buefy.modal.open({
        parent: this,
        component: ProjectShare,
        hasModalCard: true,
        props: { project }
      })
    },

    deleteProject (project) {
      this.$buefy.dialog.confirm({
        message: `Are you sure you want to delete project <b>${project.name}</b>?`,
        confirmText: 'Delete',
        type: 'is-danger',
        onConfirm: () => {
          this.$store.dispatch('projects/delete', {
            router: this.$router,
            id: project.id
          })
        }
      })
    }
  }
}
</script>
