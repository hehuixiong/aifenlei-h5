<!-- home -->
<template>
  <div class="home-container">
    <van-swipe class="my-swipe" :autoplay="3000" indicator-color="white">
      <van-swipe-item v-for="(item, index) in ad" :key="index">
        <img :src="item.pic">
      </van-swipe-item>
    </van-swipe>
    <div class="nav-list">
      <ul>
        <li v-for="(item, index) in navList" :key="index" @click="goLink(item)">
          <span class="icon-wrap">
            <img :src="item.url">
          </span>
          <span class="text">{{item.label}}</span>
        </li>
      </ul>
    </div>
    <div class="skip-list">
      <div class="skip-left item">
        <div class="skip-item" @click="goLink({ path: '/online?active=0&type=0' })">
          <img src="@/assets/images/menu-s-1@3x.png">
          <span>可回收物</span>
        </div>
        <div class="skip-item" @click="goLink({ path: '/online?active=0&type=2' })">
          <img src="@/assets/images/menu-s-2@3x.png">
          <span>家电回收</span>
        </div>
      </div>
      <div class="skip-right item">
        <div class="skip-item" @click="goLink({ path: '/online?active=0&type=1' })">
          <span>大件垃圾</span>
          <img src="@/assets/images/menu-s-3@3x.png">
        </div>
      </div>
    </div>
    <div class="classify-container">
      <div class="title"><h1>分类常识</h1></div>
      <van-list
        :loading="loading"
        :finished="finished"
        :finished-text="finishedText"
        @load="onLoad"
      >
        <div class="item" v-for="(item, index) in list" :key="index" @click="goRichtext(item)">
          <van-card
            :desc="item.creat_time"
            :title="item.title"
            :thumb="item.more.thumbnail"
          />
        </div>
      </van-list>
    </div>
  </div>
</template>

<script>
import {
  getIndex,
  getArticlesIndex
} from '@/api'
export default {
  data() {
    return {
      navList: [
        { label: '线上预约', url: require('@/assets/images/menu-1-w@3x.png'), path: '/online?active=0' },
        { label: '订单管理', url: require('@/assets/images/menu-2-w@3x.png'), path: '/online?active=1' },
        { label: '地址管理', url: require('@/assets/images/menu-3-w@3x.png'), path: '/address' },
        { label: '电话预约', url: require('@/assets/images/menu-4-w@3x.png') }
      ],
      list: [],
      loading: false,
      finished: false,
      finishedText: '没有更多了',
      page: 1,
      ad: [],
      tel: ''
    }
  },

  computed: {},

  mounted() {
    getIndex().then(res => {
      if (res.data.code === 1) {
        this.ad = [...res.data.data.ad]
        this.tel = res.data.data.tel
      }
    })
  },

  methods: {
    onLoad() {
      this.finished = false
      this.loading = true

      getArticlesIndex().then(res => {
        if (res.data.code === 1) {
          console.log(res)
          this.list = [...this.list, ...res.data.data.list]
          if (this.list.length >= res.data.data.total) {
            this.finished = true
          }

          if (this.list.length === 0) {
            this.finishedText = '暂无分类数据'
          }

          this.loading = false
          this.page++
        }
      })
    },
    goLink({ path, label }) {
      if (path) {
        this.$router.push(path)
      } else if (label === '电话预约') {
        const link = document.createElement('a')
        link.setAttribute('href', `tel:${this.tel}`)
        document.body.appendChild(link)
        link.click()
      }
    },
    goRichtext({ id }) {
      this.$router.push('/richtext?id=' + id)
    }
  }
}
</script>
<style lang="scss" scoped>
.home-container{
  background: #f7f7f7;
  overflow: hidden;
  .my-swipe {
    min-height: 211px;
    .van-swipe-item img{
      width: 100%;
      min-height: 211px;
      display: block;
    }
  }
  .nav-list{
    background: #fff;
    margin-top: 10px;
    padding: 15px 0 10px;
    ul{
      display: flex;
      li{
        width: 25%;
        display: flex;
        flex-direction: column;
        align-items: center;
        .icon-wrap{
          img{
            width: 48px;
            height: 48px;
          }
        }
        .text{
          margin-top: 10px;
        }
      }
    }
  }
  .skip-list{
    display: flex;
    margin: 10px -6px 0;
    padding: 10px 12px;
    background: #fff;
    .item{
      width: 50%;
      margin: 0 6px;
    }
    .skip-item{
      border-radius: 12px;
      display: flex;
      font-size: 20px;
      font-weight: 500;
      color: #fff;
      justify-content: center;
      align-items: center;
      cursor: pointer;
    }
    .skip-left{
      .skip-item{
        height: 74px;
        &:nth-child(1) {
          background: #146bb5;
        }
        &:nth-child(2) {
          background: #e69252;
          margin-top: 12px;
        }
        img{
          width: 32px;
          height: 32px;
          margin-right: 15px;
        }
      }
    }
    .skip-right{
      .skip-item{
        flex-direction: column;
        background: #e9696b;
        height: 160px;
        img{
          width: 50px;
          margin-top: 25px;
        }
      }
    }
  }
  .classify-container{
    margin-top: 10px;
    background: #fff;
    .title{
      line-height: 44px;
      h1{
        font-size: 16px;
        font-weight: 400;
        position: relative;
        margin: 0 20px;
        border-bottom: 1px solid #f1f1f1;
        &::before{
          position: absolute;
          content: '';
          height: 18px;
          width: 3px;
          border-radius: 4px;
          background: #75d8d5;
          left: -10px;
          top: 50%;
          transform: translateY(-50%);
        }
      }
    }
  }
  /deep/ .van-card {
    background: #ffffff;
  }
  /deep/ .van-card__thumb{
    width: 100px;
    height: 80px;
  }
  /deep/ .van-card__content{
    padding-top: 2px;
  }
  /deep/ .van-card__title{
    font-weight: 500;
    font-size: 14px;
  }
  /deep/ .van-card__desc{
    padding-top: 10px;
  }
}
</style>
