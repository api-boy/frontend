<template>
  <div>
    <Header />
    <div
      v-show="ready"
      class="columns"
    >
      <div class="column left-column is-3-fullhd is-4-widescreen is-5-desktop is-6-tablet">
        <!-- PROJECT -->
        <div class="columns is-mobile">
          <div class="column is-narrow">
            <ProjectTitle :project="project" />
          </div>
          <div class="column">
            <ProjectMenu :project="project" />
          </div>
        </div>
        <!-- FOLDERS -->
        <div class="columns">
          <div class="column">
            <Folders />
          </div>
        </div>
      </div>
      <div class="column right-column is-9-fullhd is-8-widescreen is-7-desktop is-6-tablet">
        <!-- ACTIONS -->
        <div class="columns">
          <div class="column">
            <ProjectActions :project="project" />
          </div>
        </div>
        <!-- REQUESTS -->
        <div class="columns">
          <div class="column tabs-column">
            <RequestsTabs />
          </div>
        </div>
      </div>
    </div>
    <Footer />
  </div>
</template>

<style lang="scss" scoped>
  .left-column {
    padding: 30px 30px 0 30px;
  }

  .right-column {
    padding: 30px 30px 0 0;
  }

  .tabs-column {
    overflow: auto;
  }
</style>

<script>
import Header from '../components/Header.vue'
import Footer from '../components/Footer.vue'
import ProjectTitle from '../components/ProjectTitle.vue'
import ProjectMenu from '../components/ProjectMenu.vue'
import ProjectActions from '../components/ProjectActions.vue'
import Folders from '../components/Folders.vue'
import RequestsTabs from '../components/RequestsTabs.vue'

export default {
  name: 'Project',

  components: {
    Header,
    Footer,
    ProjectTitle,
    ProjectMenu,
    ProjectActions,
    Folders,
    RequestsTabs
  },

  data () {
    return {
      projectId: null,
      watchers: [],
      ready: false
    }
  },

  computed: {
    project () {
      return this.$store.getters['projects/current']
    }
  },

  created () {
    this.projectId = this.$route.params.projectId

    this.watchers.push(
      this.$watch(() => {
        return this.$store.getters['app/isReady']
      }, (ready) => {
        if (ready) {
          this.$store.dispatch('projects/setCurrent', { projectId: this.projectId })
          this.$store.dispatch('folders/init', { projectId: this.projectId })
          this.$store.dispatch('requests/init', { projectId: this.projectId })
          this.$store.dispatch('environments/init', { projectId: this.projectId })
          this.$store.dispatch('presence/init', { projectId: this.projectId })
        }
      }, {
        immediate: true
      })
    )

    this.watchers.push(
      this.$watch(() => {
        return this.$store.getters['projects/current']
      }, (project) => {
        if (project.name) {
          this.ready = true
        }
      }, {
        immediate: true
      })
    )
  },

  destroyed () {
    this.watchers.forEach((unwatch) => {
      unwatch()
    })

    this.$store.dispatch('projects/setCurrent', { projectId: null })

    this.$store.dispatch('environments/detach')
    this.$store.dispatch('requests/detach')
    this.$store.dispatch('folders/detach')
    this.$store.dispatch('presence/detach')

    this.$store.dispatch('environments/clean')
    this.$store.dispatch('requests/clean')
    this.$store.dispatch('folders/clean')
    this.$store.dispatch('presence/clean')
  }
}
</script>
