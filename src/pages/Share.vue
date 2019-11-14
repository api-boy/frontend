<template>
  <div>
    <Header />
    <Footer />
  </div>
</template>

<style lang="scss" scoped>
</style>

<script>
import Header from '../components/Header.vue'
import Footer from '../components/Footer.vue'
import Utils from '../utils.js'

export default {
  name: 'Share',

  components: {
    Header,
    Footer
  },

  data () {
    return {
      watchers: []
    }
  },

  created () {
    const code = this.$route.params.code
    const params = Utils.decodeShareCode(code)

    if (!params) return

    this.watchers.push(
      this.$watch(() => {
        return this.$store.getters['app/isReady']
      }, (ready) => {
        if (ready) {
          this.$store.dispatch('projects/confirmShare', {
            router: this.$router,
            sharedByUserId: params.userId,
            projectId: params.projectId
          })
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
  }
}
</script>
