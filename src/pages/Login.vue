<template>
  <div>
    <Hero />
    <div class="columns is-centered">
      <div class="column is-full-mobile is-half-tablet is-one-third-desktop is-one-quarter-widescreen">
        <section class="login-form">
          <h2 class="subtitle is-2">
            Login
          </h2>
          <b-field label="Email">
            <b-input
              v-model="email"
              type="email"
              size="is-medium"
              required
              @keyup.enter.native="login"
            />
          </b-field>
          <b-field label="Password">
            <b-input
              v-model="password"
              type="password"
              size="is-medium"
              password-reveal
              required
              @keyup.enter.native="login"
            />
          </b-field>
          <div class="buttons">
            <span
              class="button is-primary is-medium is-fullwidth"
              :class="{ 'is-loading': loading }"
              @click="login"
            >Get me in!</span>
            <span
              class="button is-warning is-fullwidth"
              @click="signup"
            >I don't have a user yet.</span>
          </div>
        </section>
      </div>
    </div>
    <Footer />
  </div>
</template>

<style lang="scss" scoped>
  .login-form {
    margin: 80px 30px;

    .buttons {
      margin-top: 30px;
    }
  }
</style>

<script>
import Hero from '../components/Hero.vue'
import Footer from '../components/Footer.vue'
import Utils from '../utils.js'

export default {
  name: 'Login',

  components: {
    Hero,
    Footer
  },

  data () {
    return {
      email: '',
      password: ''
    }
  },

  computed: {
    loading () {
      return this.$store.getters['loading/requests'] > 0
    }
  },

  methods: {
    login () {
      if (this.email === '' || this.password === '') {
        return
      }

      if (this.password.length < 6) {
        return Utils.msg('Password too short (minimum length: 6 characters).')
      }

      this.$store.dispatch('auth/login', {
        router: this.$router,
        email: this.email,
        password: this.password
      })
    },

    signup () {
      this.$router.push({ name: 'signup' })
    }
  }
}
</script>
