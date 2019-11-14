<template>
  <div>
    <nav
      class="navbar"
      role="navigation"
      aria-label="main navigation"
    >
      <div class="navbar-brand">
        <h4
          class="subtitle is-4 has-text-primary btn"
          @click="goToDashboard"
        >
          ApiBoy
        </h4>
        <div class="others">
          <ul class="others-list">
            <li
              v-for="(other, ind) in others"
              :key="ind"
            >
              <Gravatar
                :email="other.email"
                :alt="other.name"
                :title="other.name"
                :size="80"
                default-img="mm"
                class="gravatar"
              />
            </li>
          </ul>
        </div>
        <div class="divider" />
        <div class="me">
          <div class="dropdown is-right is-hoverable">
            <div class="dropdown-trigger">
              <Gravatar
                :email="user.email"
                :alt="user.name"
                :title="user.name"
                :size="80"
                default-img="mm"
                class="gravatar btn"
              />
            </div>
            <div
              class="dropdown-menu"
              role="menu"
            >
              <div class="dropdown-content">
                <a
                  class="dropdown-item"
                  @click="profile"
                >
                  My Profile
                </a>
                <a
                  class="dropdown-item"
                  @click="logout"
                >
                  Logout
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  </div>
</template>

<style lang="scss" scoped>
  @import '../styles/variables';

  .navbar {
    height: 60px;
    box-shadow: 0px 1px 5px $grey;
  }

  .subtitle {
    padding: 15px 0 0 15px;
    margin: 0;
  }

  .others {
    position: absolute;
    right: 60px;
    padding-top: 10px;
  }

  .others-list {
    list-style-type: none;
    margin: 0;
    padding: 0;

    li {
      display: inline-block;
      padding-right: 10px;
    }
  }

  .divider {
    position: absolute;
    right: 55px;
    margin: 5px;
    min-width: 1px;
    max-width: 1px;
    background-color: $lightgrey;
    display: inline-block;
    height: 50px;
  }

  .me {
    position: absolute;
    right: 0;
    padding: 10px 10px 0 0;
  }

  .gravatar {
    height: 40px;
    width: 40px;
    border-radius: 40px;
  }
</style>

<script>
import Gravatar from 'vue-gravatar'

export default {
  name: 'Header',

  components: {
    Gravatar
  },

  computed: {
    user () {
      return this.$store.getters['user/data']
    },

    others () {
      return this.$store.getters['presence/others']
    }
  },

  methods: {
    goToDashboard () {
      if (this.$route.name !== 'dashboard') {
        this.$router.push({ name: 'dashboard' })
      }
    },

    profile () {
      if (this.$route.name !== 'profile') {
        this.$router.push({ name: 'profile' })
      }
    },

    logout () {
      this.$store.dispatch('auth/logout', {
        router: this.$router
      })
    }
  }
}
</script>
