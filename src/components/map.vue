<template>
  <iframe
    id="mapPage"
    width="100%"
    height="100%"
    frameborder="0"
    src="https://apis.map.qq.com/tools/locpicker?search=1&type=1&key=77LBZ-2F7K4-MFVUA-DDK5V-QG2YK-FMFFP&referer=myapp"
  >
  </iframe>
</template>
<script>
export default {
  data() {
    return {}
  },
  mounted() {
    this.$nextTick(() => {
      window.addEventListener(
        'message',
        (event) => {
          // 接收位置信息，用户选择确认位置点后选点组件会触发该事件，回传用户的位置信息
          var loc = event.data
          if (loc && loc.module === 'locationPicker') {
            // 防止其他应用也会向该页面post信息，需判断module是否为'locationPicker'
            this.$emit('getPoiaddress', loc.poiaddress)
          }
        },
        false
      )
    })
  }
}
</script>
