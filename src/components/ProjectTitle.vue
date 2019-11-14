<template>
  <article
    v-if="project && project.created"
    class="media"
  >
    <div class="media-left">
      <img
        class="project-thumb"
        :src="getPicsumImage(project.imageId, 80)"
      >
    </div>
    <div class="media-content">
      <div class="is-size-5">
        {{ project.name }}
      </div>
      <div class="is-size-7">
        {{ project.created.at.toDate().toLocaleString() }}
      </div>
    </div>
  </article>
</template>

<style lang="scss" scoped>
  .media {
    align-items: center;
    justify-content: center;

    .media-left {
      margin-top: 5px;
      margin-left: 5px;
    }
  }

  .project-thumb {
    height: 70px;
    width: 70px;
    border-radius: 70px;
  }
</style>

<script>
import Utils from '../utils.js'

export default {
  name: 'ProjectTitle',

  props: {
    project: {
      type: Object,
      default: null
    }
  },

  computed: {
    getPicsumImage () {
      return (imageId, size) => {
        return Utils.picsumImage(imageId, size)
      }
    }
  }
}
</script>
