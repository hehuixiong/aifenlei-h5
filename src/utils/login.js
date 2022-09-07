import { isAuth, getJs } from '../api'
import wx from 'weixin-js-sdk'
import { escape } from 'lodash'
export default {
  Auth() {
    isAuth().then(res => {
      console.log(res)
      if (res.data.data.isAuth === 0) {
        window.location.href = 'http://jinwan.zh-dg.com/api.php/index/user/oAuth?url=' + escape(window.location.href)
      } else {
        this.getJs()
      }
    }).catch(err => console.log(err))
  },
  getJs() {
    const data = { url: window.location.href }
    getJs(data).then(res => {
      wx.config({
        debug: false, // 生产环境需要关闭debug模式
        appId: res.data.data.appId, // appId通过微信服务号后台查看
        timestamp: res.data.data.timestamp, // 生成签名的时间戳
        nonceStr: res.data.data.nonceStr, // 生成签名的随机字符串
        signature: res.data.data.signature, // 签名
        jsApiList: [
          // 需要调用的JS接口列表
          'updateAppMessageShareData', // 分享给好友
          'updateTimelineShareData', // 分享到朋友圈
          'openLocation' // 打开地图
        ]
      })
    }).catch(err => console.log(err))
  }
}
