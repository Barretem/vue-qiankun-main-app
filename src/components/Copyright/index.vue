<template>
  <div class="copyright">
    Copyright ©
    {{ new Date().getFullYear() + ' ' + name }}
  </div>
</template>

<script>
export default {
  name: 'CopyRight',
  props: {
    name: {
      type: String,
      default: ''
    }
  }
}
</script>
<style scoped>
.copyright {
  color: rgba(0, 0, 0, 0.45);
  font-size: 14px;
  text-align: center;
  line-height: 50px;
}
</style>
