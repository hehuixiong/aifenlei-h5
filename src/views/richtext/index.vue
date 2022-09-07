<!-- richtext -->
<template>
  <div class="richtext-container">
    <h3>{{title}}</h3>
    <div v-html="content"></div>
  </div>
</template>
<script>
import { getArticlesView } from '@/api'
export default {
  data() {
    return {
      title: '',
      content: ''
    }
  },
  mounted() {
    const { id } = this.$route?.query
    getArticlesView(id).then(res => {
      if (res.data.code === 1) {
        this.content = res.data?.data?.info?.content
        this.title = res.data?.data?.info?.title
      }
    })
  }
}
</script>
<style lang="scss" scoped>
.richtext-container{
  padding: 0 10px 10px;
  overflow: hidden;
  h3{
    text-align: center;
  }
}
</style>
