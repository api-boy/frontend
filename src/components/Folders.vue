<template>
  <div class="component-menu">
    <b-menu>
      <b-menu-list>
        <b-menu-item
          v-for="(folder, i) in folders"
          :key="i"
          :active="folder.id === opened"
          :expanded="folder.id === opened"
          icon="folder"
          animation="slide"
          @click="setOpenedFolder(folder.id)"
        >
          <template slot="label">
            <div
              class="menu-item-content"
              :class="{'drop-zone': isDragging, 'drop-zone-hovered': isDragOver(folder.id)}"
              @drop="drop(folder.id)"
              @dragenter="dragEnter(folder.id)"
              @dragover.prevent="dragEnter(folder.id)"
              @dragleave="dragLeave"
            >
              <span>
                {{ folder.name }}
              </span>
              <FolderMenu :folder="folder" />
            </div>
          </template>
          <b-menu-item
            v-for="(request, j) in requests(folder)"
            :key="j"
            animation="none"
            @click="openRequest(request.id)"
          >
            <template slot="label">
              <div
                class="menu-item-content"
                draggable="true"
                @dragstart="dragStart(request.id)"
                @dragover.prevent
                @dragend="dragEnd"
              >
                <b-icon
                  icon="drag-vertical"
                  size="is-small"
                  title="Drag to move request to another folder"
                />
                <span>
                  {{ request.name }}
                </span>
                <RequestMenu :request="request" />
              </div>
            </template>
          </b-menu-item>
        </b-menu-item>
      </b-menu-list>
    </b-menu>
  </div>
</template>

<style lang="scss" scoped>
  @import '../styles/variables';

  .menu-item-content {
    display: inline;
  }

  .drop-zone {
    border: 2px dashed $lightgrey;
    padding: 0 25px;
  }

  .drop-zone-hovered {
    border-color: $yellow;
    background-color: $yellow;
    color: $darkgrey;
  }
</style>

<script>
import _ from 'lodash'
import FolderMenu from './FolderMenu.vue'
import RequestMenu from './RequestMenu.vue'

export default {
  name: 'Folders',

  components: {
    FolderMenu,
    RequestMenu
  },

  data: () => {
    return {
      draggingRequestId: null,
      draggingOverFolderId: null
    }
  },

  computed: {
    project () {
      return this.$store.getters['projects/current']
    },

    folders () {
      return _.orderBy(this.$store.getters['folders/data'], 'name')
    },

    opened () {
      return this.$store.getters['folders/opened']
    },

    requests () {
      return (folder) => {
        return _.orderBy(folder.requests, 'name')
      }
    },

    isDragging () {
      return !!this.draggingRequestId
    },

    isDragOver () {
      return (folderId) => {
        return this.draggingOverFolderId === folderId
      }
    }
  },

  methods: {
    setOpenedFolder (folderId) {
      this.$store.dispatch('folders/open', folderId)
    },

    openRequest (id) {
      this.$store.dispatch('folders/selectRequest', id)
      this.$store.dispatch('requests/open', id)
    },

    dragStart (requestId) {
      this.draggingRequestId = requestId
    },

    dragEnd () {
      this.draggingRequestId = null
    },

    dragEnter (folderId) {
      this.draggingOverFolderId = folderId
    },

    dragLeave () {
      this.draggingOverFolderId = null
    },

    drop (folderId) {
      this.draggingOverFolderId = null

      this.$store.dispatch('requests/move', {
        id: this.draggingRequestId,
        toFolderId: folderId
      })
    }
  }
}
</script>
