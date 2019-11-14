<template>
  <div>
    <table class="table is-narrow is-fullwidth headers-table">
      <tbody>
        <tr
          v-for="(val, key) in value"
          :key="key"
        >
          <td class="headers-column-no-padding">
            <label>{{ key }}</label>
          </td>
          <td>
            {{ val }}
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<style lang="scss" scoped>
  @import '../styles/variables';

  .headers-table {
    margin-bottom: 0 !important;
  }

  .headers-column-no-padding {
    padding-left: 0 !important;
    padding-right: 0 !important;
    width: 30%;
  }

  .content table tbody tr:first-child td {
    padding-top: 0 !important;
  }
</style>

<script>
export default {
  name: 'ResponseHeaders',

  props: {
    value: {
      type: Object,
      default: null
    }
  }
}
</script>
