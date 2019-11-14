<template>
  <div>
    <Header />
    <!-- PROJECTS HEADER -->
    <div class="columns is-mobile">
      <div class="column is-narrow">
        <DashboardTitle />
      </div>
      <div class="column">
        <DashboardActions />
      </div>
    </div>
    <!-- PROJECTS LIST -->
    <div class="content-wrapper columns is-multiline">
      <div
        v-for="(project, ind) in projects"
        :key="ind"
        class="column is-3-desktop is-4-tablet is-12-mobile"
      >
        <div
          class="box"
          @click="goToProject(project.id)"
        >
          <ProjectTitle :project="project" />
        </div>
      </div>
    </div>
    <Footer />
  </div>
</template>

<style lang="scss" scoped>
  @import '../styles/variables';

  .box {
    padding: 10px;
  }

  .box:hover {
    background-color: hsl(0, 0%, 96%);
    box-shadow: $shadow !important;
    cursor: pointer;
  }
</style>

<script>
import _ from 'lodash'
import Header from '../components/Header.vue'
import Footer from '../components/Footer.vue'
import DashboardTitle from '../components/DashboardTitle.vue'
import DashboardActions from '../components/DashboardActions.vue'
import ProjectTitle from '../components/ProjectTitle.vue'

export default {
  name: 'Dashboard',

  components: {
    Header,
    Footer,
    DashboardTitle,
    DashboardActions,
    ProjectTitle
  },

  computed: {
    projects () {
      return _.orderBy(this.$store.getters['projects/data'], 'name')
    }
  },

  methods: {
    goToProject (projectId) {
      this.$router.push({ name: 'project', params: { projectId } })
    }
  }
}
</script>
