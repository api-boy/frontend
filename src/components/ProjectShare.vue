<template>
  <div class="modal-content">
    <div class="box">
      <article class="media">
        <div class="media-content">
          <div class="content">
            <p>
              To share <b>{{ project.name }}</b>, just send the following link to your friends.
            </p>
            <div class="columns is-vcentered">
              <div class="column">
                <b-input
                  type="textarea"
                  custom-class="textarea-url"
                  :value="shareLink"
                  disabled
                />
              </div>
              <div class="column is-narrow copy-btn">
                <div
                  v-clipboard="shareLink"
                  class="btn"
                  title="Copy link"
                >
                  <b-icon
                    icon="content-copy"
                    type="is-primary"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </article>
    </div>
  </div>
</template>

<style lang="scss" scoped>
  .copy-btn {
    padding-left: 0;
  }
</style>

<script>
import Utils from '../utils.js'

export default {
  name: 'ProjectShare',

  props: {
    project: {
      type: Object,
      default: null
    }
  },

  data () {
    return {
      shareLink: ''
    }
  },

  created () {
    const currentUser = this.$store.getters['auth/currentUser']
    const code = Utils.encodeShareCode(currentUser.id, this.project.id)
    this.shareLink = window.location.origin + '/share/' + code
  }
}
</script>
