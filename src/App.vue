<template>
  <RouterView />
</template>

<script>
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'

NProgress.configure({ showSpinner: false })

export default {
  name: 'App',

  data () {
    return {
      watchers: []
    }
  },

  mounted () {
    this.watchers.push(
      this.$watch(() => {
        return this.$store.getters['loading/requests']
      }, (totalRequests) => {
        if (totalRequests === 1) {
          NProgress.start()
        }

        if (totalRequests === 0) {
          NProgress.done()
        }
      }, {
        immediate: true
      })
    )

    this.$nextTick(() => {
      const jwt = this.$store.getters['auth/jwt']

      if (jwt !== '') {
        this.$store.dispatch('auth/connectToFirebase', {
          router: this.$router,
          route: this.$route
        })
      } else {
        if (this.$route.name !== 'login' && this.$route.name !== 'signup') {
          this.$store.dispatch('auth/setRoute', {
            name: this.$route.name,
            params: this.$route.params
          })

          this.$router.push({ name: 'login' })
        }
      }
    })
  },

  destroyed () {
    this.watchers.forEach((unwatch) => {
      unwatch()
    })
  }
}
</script>
