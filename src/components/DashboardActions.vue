<template>
  <div class="actions-wrapper is-pulled-right">
    <b-button
      type="is-primary"
      @click="newProject()"
    >
      New project
    </b-button>
  </div>
</template>

<style lang="scss" scoped>
  .actions-wrapper {
    position: relative;
    top: 15px;
    right: 20px;
  }
</style>

<script>
export default {
  name: 'DashboardActions',

  methods: {
    newProject () {
      this.$buefy.dialog.prompt({
        message: 'Create new project',
        inputAttrs: {
          placeholder: 'Name'
        },
        onConfirm: (value) => {
          this.$store.dispatch('projects/create', {
            name: value
          })
        }
      })
    }
  }
}
</script>
