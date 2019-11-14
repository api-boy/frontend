<template>
  <div>
    <Header />
    <div class="columns is-centered profile-wrapper">
      <div class="column is-narrow">
        <a
          href="https://es.gravatar.com/gravatars/new"
          target="_blank"
        >
          <Gravatar
            :email="email"
            :alt="name"
            :title="name"
            :size="500"
            default-img="mm"
            class="gravatar btn"
          />
        </a>
      </div>

      <div class="column is-full-mobile is-half-tablet is-one-third-desktop is-one-quarter-widescreen">
        <section class="profile-form">
          <h2 class="subtitle is-4">
            My Profile
          </h2>
          <b-field label="Name">
            <b-input
              v-model="name"
              type="text"
              size="is-medium"
              @keyup.enter.native="save"
            />
          </b-field>
          <b-field label="Email">
            <b-input
              v-model="email"
              type="email"
              size="is-medium"
              @keyup.enter.native="save"
            />
          </b-field>
          <b-field label="Password">
            <b-input
              v-model="password"
              type="password"
              size="is-medium"
              password-reveal
              @keyup.enter.native="save"
            />
          </b-field>
          <div class="buttons">
            <span
              class="button is-primary is-medium is-fullwidth"
              @click="save"
            >Save</span>
          </div>
        </section>
      </div>
    </div>
    <Footer />
  </div>
</template>

<style lang="scss" scoped>
  .profile-wrapper {
    margin: 50px 20px;
  }

  .profile-form {
    .buttons {
      margin-top: 30px;
    }
  }

  .gravatar {
    height: 150px;
    width: 150px;
    border-radius: 150px;
  }
</style>

<script>
import Header from '../components/Header.vue'
import Footer from '../components/Footer.vue'
import Utils from '../utils.js'
import Gravatar from 'vue-gravatar'

export default {
  name: 'Profile',

  components: {
    Header,
    Footer,
    Gravatar
  },

  data () {
    return {
      id: '',
      name: '',
      email: '',
      password: '',
      watchers: []
    }
  },

  created () {
    const user = this.$store.getters['user/data']

    if (user) {
      this.id = user.id
      this.name = user.name
      this.email = user.email
    }

    this.watchers.push(
      this.$watch(() => {
        return this.$store.getters['user/data']
      }, (user) => {
        this.id = user.id
        this.name = user.name
        this.email = user.email
      }, {
        deep: true
      })
    )
  },

  destroyed () {
    this.watchers.forEach((unwatch) => {
      unwatch()
    })
  },

  methods: {
    save () {
      if (this.password !== '' && this.password.length < 6) {
        return Utils.msg('Password too short (minimum length: 6 characters).')
      }

      this.$store.dispatch('user/update', {
        id: this.id,
        name: this.name,
        email: this.email,
        password: this.password
      })
      this.password = ''
    }
  }
}
</script>
