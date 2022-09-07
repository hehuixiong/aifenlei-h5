// axios
import request from '@/utils/request'

// 首页配置 get 方法
export function getIndex(params) {
  return request({
    url: 'index/index',
    method: 'get',
    params,
    hideloading: true
  })
}

// 物料列表 get 方法
export function getMaterial(params) {
  return request({
    url: 'material/index',
    method: 'get',
    params,
    hideloading: true
  })
}

// 用户信息 get 方法
export function getUserInfo(params) {
  return request({
    url: 'user/index',
    method: 'get',
    params,
    hideloading: true
  })
}

// 预约时间 get 方法
export function getReservationTime(params) {
  return request({
    url: 'reservation/time',
    method: 'get',
    params,
    hideloading: true
  })
}

// 预约提交 post 方法
export function submitReservation(params) {
  return request({
    url: 'reservation/create',
    method: 'post',
    params,
    hideloading: true
  })
}

// 预约列表 get 方法
export function getReservationList(params) {
  return request({
    url: 'reservation/index',
    method: 'get',
    params,
    hideloading: true
  })
}
// 取消预约 get 方法
export function cancelReservation(params) {
  return request({
    url: 'reservation/cancel',
    method: 'get',
    params,
    hideloading: true
  })
}

// 预约详细 get 方法
export function getReservationDetail(params) {
  return request({
    url: 'reservation/detail',
    method: 'get',
    params,
    hideloading: true
  })
}

// 修改预约 post 方法
export function editReservation(data) {
  return request({
    url: 'reservation/save',
    method: 'post',
    data,
    hideloading: true
  })
}

// 地址列表 get 方法
export function getAddressList(params) {
  return request({
    url: 'address/index',
    method: 'get',
    params,
    hideloading: true
  })
}

// 详细地址 get 方法
export function getAddressDetail(params) {
  return request({
    url: 'address/detail',
    method: 'get',
    params,
    hideloading: true
  })
}

// 保存地址 pust 方法
export function submitAddress(data) {
  return request({
    url: 'address/save',
    method: 'post',
    data,
    hideloading: true
  })
}

// 删除地址 get 方法
export function delAddress(params) {
  return request({
    url: 'address/del',
    method: 'get',
    params,
    hideloading: true
  })
}

// 设置默认地址 get 方法
export function setDefaultAddress(params) {
  return request({
    url: 'address/default',
    method: 'get',
    params,
    hideloading: true
  })
}

// 投诉建议 post 方法
export function messageCreate(data) {
  return request({
    url: 'message/create',
    method: 'post',
    data,
    hideloading: true
  })
}

// 获取文章分类 get 方法
export function getArticlesCategory(data) {
  return request({
    url: 'articles/category',
    method: 'get',
    data,
    hideloading: true
  })
}

// 获取文章列表 get 方法
export function getArticlesIndex(data) {
  return request({
    url: 'articles/index',
    method: 'get',
    data,
    hideloading: true
  })
}

// 获取文章详情 get 方法
export function getArticlesView(id) {
  return request({
    url: 'articles/view?id=' + id,
    method: 'get',
    hideloading: true
  })
}

// 检查登录 get 方法
export function isAuth(data) {
  return request({
    url: 'user/isAuth',
    method: 'get',
    data,
    hideloading: true
  })
}

// 授权登录 get 方法
export function oAuth(data) {
  return request({
    url: 'user/oAuth',
    method: 'get',
    data,
    hideloading: true
  })
}

// 获取js get方法
export function getJs(data) {
  return request({
    url: 'index/getJs',
    method: 'get',
    data,
    hideloading: true
  })
}

// 上传图片 post方法
export function uploadPic(data) {
  return request({
    url: 'pic/upload',
    method: 'post',
    data,
    hideloading: true
  })
}
