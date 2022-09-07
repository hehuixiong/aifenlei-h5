<template>
  <div class="online-container">
    <van-sticky>
      <van-tabs v-model="active" @click="onClick">
        <van-tab title="线上预约"></van-tab>
        <van-tab title="订单管理"></van-tab>
      </van-tabs>
    </van-sticky>
    <OnlineMake @onClick="onClick" v-if="active === 0"></OnlineMake>
    <OnlineOrder @onClick="onClick" v-if="active === 1"></OnlineOrder>
  </div>
</template>

<script>
import OnlineMake from './components/OnlineMake.vue'
import OnlineOrder from './components/OnlineOrder.vue'
export default {
  components: {
    OnlineMake,
    OnlineOrder
  },
  data() {
    return {
      active: 0
    }
  },

  computed: {},

  mounted() {
    this.setActive()
  },

  methods: {
    setActive() {
      if (+this.$route?.query.active === 1) {
        this.active = 1
        document.title = '订单管理'
      } else {
        this.active = 0
        document.title = '线上预约'
      }
    },
    onClick(active) {
      if (active.id) {
        this.$router.replace(`/online?active=${active.index}&id=${active.id}`)
      } else {
        this.$router.replace(`/online?active=${active}`)
      }
      this.setActive()
      localStorage.removeItem('addressId')
    }
  }
}
</script>
<style lang="scss" scoped>
.online-container {
  /deep/ .van-tabs__nav--line {
    padding-bottom: 10px;
  }
  /deep/ .van-tabs__line {
    background: #4da453;
  }
  /deep/ .van-tabs__wrap {
    border-bottom: 1px solid #dbdbdb;
  }
}
</style>
