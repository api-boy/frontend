<template>
  <div>
    <Hero />
    <div class="columns is-centered">
      <div class="column is-full-mobile is-half-tablet is-one-third-desktop is-one-quarter-widescreen">
        <section class="signup-form">
          <h2 class="subtitle is-2">
            Signup
          </h2>
          <b-field label="Name">
            <b-input
              v-model="name"
              type="text"
              size="is-medium"
              required
              @keyup.enter.native="signup"
            />
          </b-field>
          <b-field label="Email">
            <b-input
              v-model="email"
              type="email"
              size="is-medium"
              required
              @keyup.enter.native="signup"
            />
          </b-field>
          <b-field label="Password">
            <b-input
              v-model="password"
              type="password"
              size="is-medium"
              password-reveal
              required
              @keyup.enter.native="signup"
            />
          </b-field>
          <div class="buttons">
            <span
              class="button is-primary is-medium is-fullwidth"
              :class="{ 'is-loading': loading }"
              @click="signup"
            >Create my user!</span>
            <span
              class="button is-warning is-fullwidth"
              @click="login"
            >I already have a user.</span>
          </div>
        </section>
      </div>
    </div>
    <Footer />
  </div>
</template>

<style lang="scss" scoped>
  .signup-form {
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
  name: 'Signup',

  components: {
    Hero,
    Footer
  },

  data () {
    return {
      name: '',
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
    signup () {
      if (this.name === '' || this.email === '' || this.password === '') {
        return
      }

      if (this.password.length < 6) {
        return Utils.msg('Password too short (minimum length: 6 characters).')
      }

      this.$store.dispatch('auth/signup', {
        router: this.$router,
        name: this.name,
        email: this.email,
        password: this.password
      })
    },

    login () {
      this.$router.push({ name: 'login' })
    }
  }
}
</script>
