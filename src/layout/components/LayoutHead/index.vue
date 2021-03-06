<template>
  <div class="layout-Head">
    <div class="fixed-head">
      <h1 class="head-logo">
        <svg-icon icon-class="logo" />
        <span>SPaaS</span>
      </h1>
      <!-- 头部菜单 -->
      <div class="head-menu">
        <ul class="clearfix">
          <li
            v-for="(item, index) in headMenu"
            :key="index"
            :class="{active: url === item.url}"
            @click="handleMenu(item)"
          >
            <span class="button-container">{{ item.name }}</span>
          </li>
        </ul>
      </div>
      <div class="head-right">
        <el-tooltip content="Global Size" effect="dark" placement="bottom">
          <size-select id="size-select" class="right-menu-item hover-effect" />
        </el-tooltip>
        <screenfull id="screenfull" class="right-menu-item hover-effect" />

        <div class="head-active">
          <img :src="userImg" class="userName-Img" alt="userName-Img">
        </div>
        <!-- 用户名称 -->
        <div class="userName-text">{{ userName }}</div>
        <el-dropdown placement="bottom-end" @command="exitBtn">
          <span class="el-dropdown-link">
            <i class="el-icon-arrow-down el-icon--right set-Iconcolor" />
          </span>
          <el-dropdown-menu slot="dropdown" class="user-drop-menu">
            <el-dropdown-item
              v-for="(item, index) in dropdownList"
              :key="index"
              :command="item.command"
            >{{ item.title }}</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
    </div>
  </div>
</template>

<script>
import cookie from 'js-cookie'
import Screenfull from '@/components/Screenfull'
import SizeSelect from '@/components/SizeSelect'

export default {
  name: 'LayoutHead',
  components: {
    Screenfull,
    SizeSelect
  },
  props: {
    searchUrl: {
      type: Object,
      default() {
        return {
          url: ''
        }
      }
    }
  },
  data() {
    const currentHref = this.getCurrentPath()
    return {
      url: currentHref,
      activeIndex: 'console',
      dropdownList: [
        {
          title: '退出',
          command: 'exit'
        }
      ],
      searchType: 'default',
      headMenu: [
        {
          name: '控制台',
          type: 'console',
          url: '/spaas-console/index.html'
        },
        {
          name: '帮助中心',
          type: 'resources',
          url: '/spaas-console/index.html#/document'
        }
      ]
    }
  },
  computed: {
    userName() {
      return cookie.get('username') || 'sPaaS'
    },
    userImg() {
      return (
        this.$store.state.user.avatar ||
        'https://deepexi.oss-cn-shenzhen.aliyuncs.com/xpaas-console/user-portrait.png'
      )
    }
  },
  methods: {
    async exitBtn(key) {
      if (key === 'exit') {
        await this.$store.dispatch('user/logout')
        this.$router.push(`/login?redirect=${this.$route.fullPath}`)
      }
    },
    handleMenu(item) {
      const url = item.url
      if (url !== this.getCurrentPath()) {
        const currentOrigin = window.location.origin
        window.location.href = `${currentOrigin}${url}`
      }
    },
    getCurrentPath() {
      const currentPath = window.location.href.split('#/')[0]
      const currentOrigin = window.location.origin
      const path = currentPath.split(currentOrigin)[1] || ''
      const pathStr = path.replace(/(^\/*)/g, '')
      return `/${pathStr}`
    }
  }
}
</script>

<style lang="scss" scoped>
$headMenu: rgba(255, 255, 255, 0.85);
$hoverColor: #fff;

.layout-Head {
  height: 60px;
  .fixed-head {
    display: flex;
    width: 100%;
    background: rgba(45, 48, 59, 1);
    .head-logo {
      display: flex;
      justify-content: flex-start;
      align-items: center;
      width: 200px;
      padding-left: 24px;
      cursor: default;
      font-size: 1.5em;
      > span {
        padding: 0 10px;
        font-weight: 300;
        font-size: 26px;
        color: #fff;
      }
    }

    .head-menu {
      flex: 1;

      ul {
        img {
          width: 100%;
          height: 100%;
        }

        color: $headMenu;
        font-size: 14px;

        li {
          float: left;
          cursor: pointer;
          list-style: none;

          &:hover {
            color: $hoverColor;
          }

          .button-container {
            display: block;
            height: 60px;
            line-height: 60px;
            margin: 0 20px;
          }
        }

        .active {
          color: rgba(255, 255, 255, 1);

          .button-container {
            position: relative;

            &::after {
              content: '';
              position: absolute;
              bottom: 12px;
              display: block;
              width: 100%;
              height: 2px;
              background: rgba(255, 255, 255, 1);
            }
          }
        }
      }
    }

    .head-right {
      margin-right: 20px;
      display: flex;
      align-items: center;

      div {
        display: inline-block;
      }

      .set-Iconcolor {
        color: $headMenu;
      }

      .head-active {
        padding-left: 10px;
        .userName-Img {
          width: 30px;
          height: 30px;
          border-radius: 50%;
          margin-right: 10px;
        }
      }

      .userName-text {
        text-align: center;
        overflow: hidden;
        color: #fff;
        margin-right: 10px;
      }

      .head-search {
        .set-search {
          margin-right: 5px;
        }

        .head-autocomplete {
          .el-icon-search {
            cursor: pointer;
            font-size: 18px;
          }
        }

        .el-dropdown-link {
          font-size: 18px;
          color: #a2a2b1 !important;
        }
      }

      .head-message {
        margin: 0 30px 0 20px;

        .item {
          .set-IconSize {
            height: 100%;
            max-width: 100%;
          }
        }
      }
    }
  }

  .right-menu-item {
      display: inline-block;
      line-height: 60px;
      padding: 0 16px;
      height: 100%;
      font-size: 18px;
      color: #fff;
      vertical-align: text-bottom;

      &.hover-effect {
        cursor: pointer;
        transition: background .3s;

        &:hover {
          background: rgba(0, 0, 0, .025)
        }
      }
    }
}

.el-badge .el-badge__content {
  border: 0;
}

.el-dropdown-menu .popper__arrow {
  display: none;
}
</style>
