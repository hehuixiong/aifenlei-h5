<!-- address-add -->
<template>
  <div class="address-add-container">
    <van-form @submit="onSubmit">
      <van-field
        v-model="addressForm.name"
        label="姓名"
        placeholder="请输入姓名"
      />
      <van-field
        v-model="addressForm.tel"
        label="手机"
        placeholder="请输入手机号码"
      />
      <van-field
        label="选择地址"
        placeholder="请选择地址"
        v-model="addressForm.address"
        @click="clickArea"
        readonly
      />
      <van-field
        label="详细地址"
        placeholder="请输入详细地址"
        v-model="addressForm.detail"
        clearable
      />
      <van-field class="default" label="设为默认收货地址">
        <template #input>
          <van-switch v-model="addressForm.default" size="20" />
        </template>
      </van-field>
      <div style="margin: 16px;">
        <van-button round block type="info" native-type="submit">提交</van-button>
      </div>
    </van-form>
  </div>
</template>

<script>
import { Toast } from 'vant'
import { submitAddress, getAddressDetail } from '@/api'
export default {
  data() {
    return {
      addressForm: {
        name: '',
        tel: '',
        address: '',
        detail: '',
        default: false,
        id: 0
      }
    }
  },

  computed: {},

  mounted() {
    const addressForm = sessionStorage.getItem('addressForm') && JSON.parse(sessionStorage.getItem('addressForm'))
    if (addressForm) {
      this.addressForm = {
        name: addressForm?.name,
        tel: addressForm?.tel,
        detail: addressForm?.detail,
        default: addressForm?.default,
        address: addressForm?.address,
        id: addressForm?.id
      }
    }
    if (this.$route?.query?.addr) {
      this.addressForm.address = this.$route?.query?.addr
    }
    if (this.$route?.query?.id) {
      this.addressForm.id = this.$route?.query?.id
      this.getAddress(this.$route?.query?.id)
    }
  },

  methods: {
    clickArea() {
      sessionStorage.setItem('addressForm', JSON.stringify(this.addressForm))
      window.location.href = 'https://mapapi.qq.com/web/mapComponents/locationPicker/v/index.html?search=1&type=0&key=77LBZ-2F7K4-MFVUA-DDK5V-QG2YK-FMFFP&referer=myapp&backurl=' + window.location.href
    },
    getAddress(id) {
      Toast.loading({
        message: '请稍等...',
        forbidClick: true,
        loadingType: 'spinner'
      })
      getAddressDetail({ id })
        .then(res => {
          console.log(res)
          this.addressForm = {
            name: res.data?.data?.info?.name,
            tel: res.data?.data?.info?.tel,
            address: res.data?.data?.info?.address,
            detail: res.data?.data?.info?.detail,
            default: Boolean(res.data?.data?.info?.default),
            id: res.data?.data?.info?.id
          }
          Toast.clear()
        })
        .catch(() => Toast.clear())
    },
    validatePhTelNumber(str) {
      const reg = /^[1][3,4,5,6,7,8,9][0-9]{9}$/
      return reg.test(str)
    },
    onSubmit() {
      if (
        !this.addressForm?.name ||
        !this.addressForm?.tel ||
        !this.addressForm?.address ||
        !this.addressForm?.detail
      ) {
        Toast({
          message: '请完善信息',
          icon: 'fail'
        })
        return
      }
      if (!this.validatePhTelNumber(this.addressForm?.tel)) {
        Toast('请输入正确格式的手机号')
        return
      }
      Toast.loading({
        message: '请稍等...',
        forbidClick: true,
        loadingType: 'spinner'
      })
      submitAddress({
        id: this.addressForm.id,
        name: this.addressForm.name,
        tel: this.addressForm.tel,
        address: this.addressForm.address,
        detail: this.addressForm.detail,
        default: Number(this.addressForm.default)
      }).then(res => {
        if (res.data.code === 1) {
          const message = this.addressForm.id ? '编辑' : '新增'
          Toast({ message: `${message}成功`, icon: 'passed' })
          const timer = setTimeout(() => {
            this.$router.replace('/address')
            sessionStorage.removeItem('addressForm')
            clearTimeout(timer)
          }, 1000)
        }
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.address-add-container {
  padding-top: 20px;
  /deep/ .van-button--info {
    background: #4da453;
    border-color: #4da453;
    height: 40px;
  }
  /deep/ .van-switch--on {
    background: #4da453;
  }
  /deep/ .van-field.default{
    display: flex;
    justify-content: space-between;
    .van-field__label{
      flex: 1;
    }
    .van-field__value{
      flex: 0;
    }
  }
}
</style>
