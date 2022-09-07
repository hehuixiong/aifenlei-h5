<template>
  <div id="app">
    <keep-alive v-if="isRouter">
      <router-view v-if="$route.meta.keepAlive"></router-view>
    </keep-alive>
    <router-view v-if="!$route.meta.keepAlive"></router-view>
  </div>
</template>
<script>
export default {
  name: 'App',
  data() {
    return {
      isRouter: true
    }
  },
  created() {
    this.Login.Auth()
  },
  watch: {
    '$route': {
      handler: function(to, form) {
        // 预约回来清掉缓存
        if (to.path === '/' && form.path === '/online') {
          this.isRouter = false
          this.$nextTick(() => {
            this.isRouter = true
          })
          localStorage.removeItem('addressId')
        }
      }
    }
  }
}
</script>
<style lang="scss">
#app{
  font-size: 14px;
  height: 100%;
}
</style>
