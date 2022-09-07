<!-- order -->
<template>
  <div class="order-container">
    <van-list
      v-model="loading"
      :finished="finished"
      :finished-text="finishedText"
      @load="onLoad"
      :style="{visibility: show ? 'hidden' : ''}"
    >
      <div class="order-item" v-for="(item, index) in list" :key="index">
        <div class="item">
          <span>订单编号：{{item.sn}}</span>
          <span style="color: #ff3d3d;">{{item.status_str}}</span>
        </div>
        <div class="item">
          <span>下单时间</span>
          <span>{{item.create_time}}</span>
        </div>
        <div  class="item">
          <span>下单方式</span>
          <span>{{item.reservation_type}}</span>
        </div>
        <div class="btns">
          <van-button v-if="item.status === 0" type="info" color="#bbbbbb" size="small" plain round @click="onCancel(item)">取消</van-button>
          <van-button type="info" color="#bbbbbb" size="small" plain round @click="onShow(item)">查看详情</van-button>
          <van-button v-if="item.status === 0" type="info" color="#bbbbbb" size="small" plain round @click="onEdit(item)">修改订单</van-button>
        </div>
      </div>
    </van-list>
    <template v-if="show">
      <div class="order-details" @touchmove.prevent>
        <div class="show">
          <div class="details-wrapper" v-if="details.info">
            <div class="item">
              <span>订单编号：{{details.info.sn}}</span>
              <span style="color: #ff3d3d;">{{details.info.status_str}}</span>
            </div>
            <div class="item">
              <span>下单时间</span>
              <span>{{details.info.create_time}}</span>
            </div>
            <div  class="item">
              <span>下单方式</span>
              <span>{{details.info.reservation_type}}</span>
            </div>
            <div class="item">
              <span>期待上门时间</span>
              <span>{{details.info.day}} {{details.info.time}}</span>
            </div>
            <div class="item" v-if="details.address">
              <span>上门地点</span>
              <span>{{details.address.address}}</span>
            </div>
            <div  class="item" v-if="details.address">
              <span>联系人</span>
              <span>{{details.address.name}}</span>
            </div>
            <div class="item" v-if="details.address">
              <span>联系电话</span>
              <span>{{details.address.tel}}</span>
            </div>
            <div class="item">
              <span>预估种类</span>
              <span>{{details.info.material_str}}</span>
            </div>
            <div class="item">
              <span>预估重量</span>
              <span>{{details.info.kg}}kg</span>
            </div>
            <div class="item" v-if="details.info.remark">
              <span>说明</span>
              <span>{{details.info.remark}}</span>
            </div>
            <div class="item" style="align-items: flex-start;">
              <span>照片</span>
              <span style="margin-top: 5px;">
                <van-image
                  width="80"
                  height="80"
                  :src="details.info.pic_url"
                  @click="showPic(details.info.pic_url)"
                />
              </span>
            </div>
          </div>
          <div class="back-btn">
            <van-button type="primary" size="small" round @click="show = false">返回</van-button>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<script>
import { Toast, ImagePreview } from 'vant'
import {
  getReservationList,
  getReservationDetail,
  cancelReservation
} from '@/api'
export default {
  data() {
    return {
      show: false,
      list: [],
      details: {},
      loading: false,
      finished: false,
      page: 1,
      finishedText: '没有更多了'
    }
  },

  computed: {
  },

  mounted() {
  },

  methods: {
    onLoad() {
      this.finished = false
      this.loading = true
      getReservationList({ page: this.page }).then(res => {
        if (res.data.code === 1) {
          console.log(res)
          this.list = [...this.list, ...res.data.data.list]
          if (this.list.length >= res.data.data.total) {
            this.finished = true
          }
          if (this.list.length === 0) {
            this.finishedText = '暂无预约订单'
          }
          this.loading = false
          this.page++
        }
      })
    },
    onShow({ id }) {
      this.details = {}
      Toast.loading({
        message: '请稍等...',
        forbidClick: true,
        loadingType: 'spinner'
      })
      getReservationDetail({ id }).then(res => {
        if (res.data.code === 1) {
          this.details = res.data.data
          this.show = true
          Toast.clear()
        }
      })
    },
    onCancel({ id }) {
      Toast.loading({
        message: '请稍等...',
        forbidClick: true,
        loadingType: 'spinner'
      })
      cancelReservation({ id }).then(res => {
        if (res.data.code === 1) {
          this.page = 1
          this.list = []
          Toast.clear()
          this.onLoad()
        }
      })
    },
    onEdit({ id }) {
      this.$emit('onClick', { id, index: 0 })
    },
    showPic(url) {
      ImagePreview({
        images: [url],
        closeable: true
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.order-container{
  padding-top: 10px;
  background: #fff;
  /deep/ .van-list{
    .order-item{
      margin: 0 10px;
      box-shadow: 0 2px 12px 0 rgba(0,0,0, .1);
      padding: 10px;
      margin-bottom: 10px;
      border-radius: 4px;
      .item{
        line-height: 30px;
        display: flex;
        width: 100%;
        justify-content: space-between;
      }
      .btns{
        display: flex;
        justify-content: flex-end;
        button{
          margin-left: 10px;
          line-height: 26px!important;
          height: 26px!important;
          color: #333!important;
          min-width: 70px;
        }
      }
    }
  }
  .order-details{
    width: 100%;
    height: 100vh;
    overflow: hidden;
    .show{
      position: fixed;
      top: 55px;
      width: 100%;
    }
    .details-wrapper{
      margin: 0 10px;
      box-shadow: 0 2px 12px 0 rgba(0,0,0, .1);
      padding: 10px;
      margin-bottom: 10px;
      border-radius: 4px;
      .item{
        line-height: 30px;
        display: flex;
        width: 100%;
        justify-content: space-between;
        align-items: baseline;
        span:nth-child(2) {
          max-width: 230px;
          line-height: 22px;
        }
      }
    }
    .back-btn{
      display: flex;
      justify-content: center;
      margin-top: 20px;
      button{
        min-width: 180px!important;
      }
    }
  }
}
</style>
