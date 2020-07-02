<template>
  <div class="sidebar-logo-container" :class="{'collapse':collapse}">
    <transition name="sidebarLogoFade">
      <router-link v-if="collapse" key="collapse" class="sidebar-logo-link" to="/">
        <div class="system-name">
          <img :src="appIcon || require('@/assets/images/default_icon.svg')">
        </div>
      </router-link>
      <router-link v-else key="expand" class="sidebar-logo-link" to="/">
        <div class="system-name">
          <img :src="appIcon || require('@/assets/images/default_icon.svg')">
          <span>{{ title }}</span>
        </div>
      </router-link>
    </transition>
  </div>
</template>

<script>
export default {
  name: 'SidebarLogo',
  props: {
    title: {
      type: String,
      required: true
    },
    collapse: {
      type: Boolean,
      required: true
    },
    appIcon: {
      type: String,
      default: ''
    }
  }
}
</script>

<style lang="scss" scoped>
.sidebarLogoFade-enter-active {
  transition: opacity 1.5s;
}

.sidebarLogoFade-enter,
.sidebarLogoFade-leave-to {
  opacity: 0;
}

.sidebar-logo-container {
  position: relative;
  width: 100%;
  height: 50px;
  line-height: 50px;
  background: #f2f4f9;
  text-align: center;
  overflow: hidden;

  & .system-name {
    user-select: none;
    height: 50px;
    line-height: 50px;
    font-size: 16px;
    font-weight: 500;
    background-color: #fff;
    padding-left: 18px;
    position: relative;
    display: flex;
    align-items: center;
    > img {
      width: 23px;
      height: 23px;
    }
    > span {
      min-width: 154px;
      margin-left: 6px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      text-align: left;
    }
  }

  & .sidebar-logo-link {
    height: 100%;
    width: 100%;

    & .sidebar-logo {
      width: 32px;
      height: 32px;
      vertical-align: middle;
      margin-right: 0px !important;
    }

    & .sidebar-title {
      display: inline-block;
      margin: 0;
      color: #2d303b;
      font-weight: 500;
      line-height: 50px;
      font-size: 14px;
      font-family: Avenir, Helvetica Neue, Arial, Helvetica, sans-serif;
      vertical-align: middle;
    }
  }

  &.collapse {
    .sidebar-logo {
      margin-right: 0px;
    }
  }
}
</style>
