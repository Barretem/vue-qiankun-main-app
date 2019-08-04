<template>
  <div class="hamburger-container" style="padding: 0 15px;" @click="toggleClick">
    <svg-icon icon-class="expand" :class="{'is-active':isActive}" style="margin-right: 0" class="hamburger" />
  </div>
</template>

<script>
export default {
  name: 'Hamburger',
  props: {
    isActive: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    toggleClick() {
      this.$emit('toggleClick')
    }
  }
}
</script>

<style lang="scss" scoped>
.hamburger-container {
  color: #545456;
  .hamburger {
    display: inline-block;
    vertical-align: middle;
    font-size: 16px;
  }

  .hamburger.is-active {
    transform: rotate(180deg);
  }
}
</style>
