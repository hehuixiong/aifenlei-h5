<!-- online -->
<template>
  <div class="online-make-container">
    <van-form @submit="onSubmit">
      <!-- 物品种类 -->
      <van-cell is-link @click="showKind = true">
        <!-- 使用 title 插槽来自定义标题 -->
        <template #title>
          <span class="custom-title">物品种类</span>
        </template>
        <template #right-icon>
          <span v-if="kindId.length">
            <van-tag style="margin-right: 6px;" v-for="(tag, index) in selectedKind" :key="index" type="success" v-if="index < 3">{{tag}}</van-tag>
            <span v-if="kindId.length > 3">等{{kindId.length}}种</span>
          </span>
          <span v-else style="color: #bcbdbf;">请选择种类</span>
        </template>
      </van-cell>
      <!-- 预估重量 -->
      <van-field name="stepper" label="预估重量" input-align="right">
        <template #input> <van-stepper v-model="form.stepper" /><span style="margin-left: 5px">公斤</span> </template>
      </van-field>
      <!-- 期望上门时间 -->
      <van-field
        readonly
        clickable
        name="datetimePicker"
        :value="form.date"
        label="期望上门时间"
        :placeholder="timeId ? currentTime : '请选择时间'"
        @click="showTime = true"
        input-align="right"
        :class="{'is-active': timeId}"
      ></van-field>
      <!-- 请选择上门地址 -->
      <van-cell title="请选择上门地址" is-link @click="goAddress">
        <template #right-icon>
          <span v-if="addressDetail">{{addressDetail}}</span>
          <span v-else style="color: #bcbdbf;">请选择</span>
        </template>
      </van-cell>
      <!-- 其他说明 -->
      <van-field v-model="form.remark" label="其他说明" placeholder="请输入其他说明" input-align="right"></van-field>
      <!-- 图片 -->
      <van-cell>
        <!-- 使用 title 插槽来自定义标题 -->
        <template #title>
          <span class="custom-title">照片</span>
        </template>
        <template #right-icon>
          <van-uploader v-model="fileList" :max-count="1" :after-read="afterRead" :before-read="beforeRead" />
        </template>
      </van-cell>
      <p class="msg">小于5公斤暂不保证能成功调度上门回收人员</p>
      <div style="margin: 16px">
        <van-button round block type="info" native-type="submit">提交</van-button>
      </div>
    </van-form>
    <van-action-sheet v-model="showKind" title="种类选择">
      <van-tree-select :items="kinds" :active-id.sync="kindId" :main-active-index.sync="kindIndex" @click-nav="clickKindIndex" />
    </van-action-sheet>
    <van-action-sheet v-model="showTime" title="时间选择">
      <van-tree-select :items="times" :active-id.sync="timeId" :main-active-index.sync="timeIndex" @click-nav="clickTimeIndex" @click-item="clickTimeItem" />
    </van-action-sheet>
  </div>
</template>

<script>
import {
  submitReservation,
  getReservationTime,
  getAddressDetail,
  getReservationDetail,
  editReservation,
  getMaterial,
  uploadPic
} from '@/api'
import { Toast } from 'vant'
import { ImageCompressorFn } from '@/utils'
export default {
  data() {
    return {
      form: {
        stepper: 1,
        remark: '',
        pic_url: ''
      },
      showKind: false,
      timeId: 0,
      timeIndex: 0,
      addressId: 0,
      showTime: false,
      times: [],
      addressDetail: '',
      orderId: null,
      kinds: [],
      kindId: [],
      kindIndex: 0,
      fileList: []
    }
  },

  computed: {
    currentTime() {
      const { text: day } = this.times[this.timeIndex]
      const { text: time } = this.times[this.timeIndex].children.filter(item => item.id === this.timeId)[0]
      return day + ' ' + time
    },
    selectedKind() {
      const tags = []
      this.kinds.map(item => {
        item.children.map((child) => {
          if (this.kindId.length) {
            for (let i = 0; i < this.kindId.length; i++) {
              if (child.id === this.kindId[i]) {
                tags.push(child.text)
              }
            }
          }
        })
      })
      return tags
    }
  },

  async mounted() {
    this.kindIndex = +this.$route.query.type || 0
    this.orderId = this.$route.query.id
    if (this.orderId) {
      Toast.loading({
        message: '请稍等...',
        forbidClick: true,
        loadingType: 'spinner'
      })
    }
    await this.getMaterial()
    await this.getReservationTime()
    if (this.orderId) {
      await this.getReservationDetail(this.orderId)
    }
  },
  activated() {
    this.addressId = localStorage.getItem('addressId')
    if (this.addressId) {
      this.getAddress(this.addressId)
    }
  },

  methods: {
    // 选择种类
    clickKindIndex(index) {
      this.kindIndex = index
    },
    // 选择时间
    clickTimeIndex(index) {
      this.timeIndex = index
      this.timeId = 0
    },
    clickTimeItem(data) {
      console.log(data)
      this.timeId = data.id
      this.showTime = false
    },
    goAddress() {
      this.$router.push('/address?selected=1')
    },
    async beforeRead(file, callback) {
      try {
        const compressorFile = await ImageCompressorFn(file)
        const fileSize = parseFloat(parseInt(compressorFile['size']) / 1024 / 1024).toFixed(2)
        if (fileSize > 1) {
          Toast('照片大小不能超过 1M')
          callback(false)
        }
      } catch (error) {
        // ...
      }
    },
    async afterRead(data) {
      try {
        const compressorFile = await ImageCompressorFn(data.file)
        const targetFormData = new FormData()
        targetFormData.append('file', compressorFile)
        Toast.loading({
          message: '请稍等...',
          forbidClick: true,
          loadingType: 'spinner'
        })
        uploadPic(targetFormData).then(res => {
          if (res.data.code === 1) {
            this.form.pic_url = res.data.data.url
            Toast.clear()
          } else {
            this.fileList = []
          }
        }).catch(() => (this.fileList = []))
      } catch (error) {
        // ...
      }
    },
    async getMaterial() {
      await getMaterial().then(res => {
        if (res.data.code === 1) {
          this.kinds = res.data.data.list.map(item => {
            return {
              text: item.title,
              id: item.id,
              children: item.children.map(child => {
                return {
                  text: child.title,
                  id: child.id
                }
              })
            }
          })
          console.log(this.kinds)
        }
      })
    },
    async getReservationTime() {
      await getReservationTime().then(res => {
        if (res.data.code === 1) {
          this.times = res.data.data.list.map(item => {
            return {
              text: item.title,
              disabled: !item.open,
              day: item.day,
              children: item.children.map((child, index) => {
                return {
                  text: child.time,
                  id: index + 1
                }
              })
            }
          })
        }
      })
    },
    async getReservationDetail(id) {
      await getReservationDetail({ id }).then(res => {
        if (res.data.code === 1) {
          console.log(res)
          this.addressDetail = res.data?.data?.address?.address
          this.addressId = res.data?.data?.address?.id
          for (let i = 0; i < this.times.length; i++) {
            if (this.times[i].day === res.data?.data?.info?.day) {
              this.timeIndex = i
              for (let j = 0; j < this.times[i].children.length; j++) {
                if (this.times[i].children[j].text === res.data?.data?.info?.time) {
                  this.timeId = j + 1
                }
              }
            }
          }
          this.kindId = res.data?.data?.info?.material.map(id => Number(id))
          this.form.remark = res.data?.data?.info?.remark
          this.form.stepper = res.data?.data?.info?.kg
          this.form.pic_url = res.data?.data?.info?.pic_url
          this.fileList = [{ url: this.form.pic_url }]
          Toast.clear()
        }
      })
    },
    getAddress(id) {
      getAddressDetail({ id }).then(res => {
        console.log(res)
        this.addressDetail = res.data?.data?.info?.address
        Toast.clear()
      }).catch(() => Toast.clear())
    },
    onSubmit() {
      if (!this.kindId.length) {
        Toast('请选择物品种类')
        return
      }
      if (!this.timeId) {
        Toast('请选择上门时间')
        return
      }
      if (!this.addressId) {
        Toast('请选择上门地址')
        return
      }
      const { day } = this.times[this.timeIndex]
      const { text: time } = this.times[this.timeIndex].children.filter(item => item.id === this.timeId)[0]
      Toast.loading({
        message: '请稍等...',
        forbidClick: true,
        loadingType: 'spinner'
      })
      let api, message
      const params = {
        address_id: this.addressId,
        day: day,
        time: time,
        material: this.kindId,
        kg: this.form.stepper,
        remark: this.form.remark,
        pic_url: this.form.pic_url
      }
      if (this.orderId) {
        api = editReservation
        params.id = this.orderId
        message = '修改成功'
      } else {
        api = submitReservation
        message = '预约成功'
      }
      api(params).then(res => {
        if (res.data.code === 1) {
          console.log(res)
          Toast({ message, icon: 'passed' })
          // 重置数据
          this.addressId = 0
          this.timeIndex = 0
          this.timeId = 0
          this.kindIndex = 0
          this.kindId = 0
          this.form.stepper = 1
          this.form.remark = ''
          this.addressDetail = ''
          this.form.pic_url = ''
          localStorage.removeItem('addressId')
          this.$emit('onClick', 1)
        }
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.online-make-container {
  background: #fff;
  .msg {
    font-size: 12px;
    color: #c13f3f;
    padding-left: 15px;
    padding-top: 5px;
  }
  /deep/ .van-button--info {
    background: #4da453;
    border-color: #4da453;
    height: 40px;
    line-height: 40px;
  }
  /deep/ .van-cell__title {
    color: #646566;
  }
  /deep/ .van-field.is-active input::-webkit-input-placeholder{
    color:#323233;
  }
  /deep/ .van-cell__value{
    color: #bcbdbf;
  }
  /deep/ .van-cell__right-icon{
    color: #bcbdbf;
  }
  /deep/ .van-cell__title{
    min-width: 100px;
    margin-right: 10px;
  }
  /deep/ .van-uploader__preview,
  /deep/ .van-uploader__upload{
    margin: 0!important;
  }
}
</style>
