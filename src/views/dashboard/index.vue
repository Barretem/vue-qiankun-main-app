<template>
  <div class="index">
    <img :src="introductionImg" alt="业务中台">
  </div>
</template>

<script>
import introductionImg from './images/introduction.png'

export default {
  name: 'Index',
  data() {
    return {
      introductionImg
    }
  }
}
</script>

<style lang="scss" scoped>
.index {
  height: 100%;
  background: #f7f8fb;
  background-size: 100%, auto;
  background-repeat: no-repeat;
  display: flex;
  justify-content: center;
  align-items: center;
  > img {
    width: 523px;
    height: 132px;
  }
}
</style>
