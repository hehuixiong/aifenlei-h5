<!-- address -->
<template>
  <div class="address-container">
    <template>
      <van-address-list
        v-model="chosenAddressId"
        :list="list"
        default-tag-text="默认"
        @add="onAdd"
        @edit="onEdit"
        @select="onSelect"
        :switchable="switchable"
      >
        <template #item-bottom="item">
          <span class="set-default" v-if="!item.isDefault" @click.stop="setDefault(item)">设为默认</span>
          <div class="btns">
            <span @click.stop="onEdit(item)">修改</span>
            <span @click.stop="onDel(item)">删除</span>
          </div>
        </template>
      </van-address-list>
    </template>
    <div class="no-address" v-if="!list.length">
      <img src="@/assets/images/no-address.png">
      暂无收货地址
    </div>
  </div>
</template>

<script>
import { Toast } from 'vant'
import {
  getAddressList,
  delAddress,
  setDefaultAddress
} from '@/api'
export default {
  data() {
    return {
      chosenAddressId: '1',
      switchable: false,
      list: []
    }
  },

  computed: {},

  mounted() {
    this.switchable = Boolean(this.$route.query.selected)
    this.getAddressList()
  },

  methods: {
    getAddressList() {
      Toast.loading({
        message: '请稍等...',
        forbidClick: true,
        loadingType: 'spinner'
      })
      getAddressList().then(res => {
        if (res.data.code === 1) {
          this.list = res.data.data.list.map((item) => {
            return {
              isDefault: item.default,
              address: item.address + item.detail,
              id: item.id,
              name: item.name,
              tel: item.tel
            }
          })
          Toast.clear()
        }
      }).catch(() => Toast.clear())
    },
    onAdd() {
      this.$router.push('/address-add')
    },
    onEdit({ id }) {
      this.$router.push('/address-edit?id=' + id)
    },
    onDel({ id }) {
      Toast.loading({
        message: '请稍等...',
        forbidClick: true,
        loadingType: 'spinner'
      })
      delAddress({ id }).then(res => {
        if (res.data.code === 1) {
          this.getAddressList()
          Toast({ message: '删除成功', icon: 'passed' })
        }
      })
    },
    setDefault({ id }) {
      Toast.loading({
        message: '请稍等...',
        forbidClick: true,
        loadingType: 'spinner'
      })
      setDefaultAddress({ id }).then(res => {
        if (res.data.code === 1) {
          this.getAddressList()
          Toast({ message: '设置成功', icon: 'passed' })
        }
      })
    },
    onSelect({ id }) {
      localStorage.setItem('addressId', id)
      this.$router.go(-1)
    }
  }
}
</script>
<style lang="scss" scoped>
.address-container{
  /deep/ .van-address-item {
    flex: 1;
  }
  /deep/ .van-cell__value{
    padding-right: 0;
  }
  /deep/ .van-icon-edit{
    display: none;
  }
  /deep/ .van-address-item__name{
    justify-content: space-between;
  }
  /deep/ .van-address-item__address{
    padding-right: 80px;
  }
  /deep/ .van-address-item{
    position: relative;
  }
  /deep/ .van-button--danger{
    background: #4da453;
    border-color: #4da453;
  }
  /deep/ .van-address-item .van-radio__icon--checked .van-icon{
    background: #4da453;
    border-color: #4da453;
  }
  /deep/ .van-address-item__tag{
    padding: 2px 10px;
    background: #d2f6e0;
    color: #127d3b;
  }
  .set-default{
    position: absolute;
    right: 0;
    top: 5px;
    font-size: 13px;
    color: #4ca291;
    padding: 8px;
  }
  .btns{
    position: absolute;
    right: 0;
    top: 33px;
    display: flex;
    span{
      color: #ff3d3d;
      padding: 8px;
      cursor: pointer;
      font-size: 13px;
    }
  }
  .no-address{
    display: flex;
    justify-content: center;
    flex-direction: column;
    color: #999999;
    align-items: center;
    img{
      width: 200px;
    }
  }
}
</style>
