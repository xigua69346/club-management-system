<template>
  <div class="test">
    <h1>测试页面</h1>
    <p>路由测试成功！</p>
    <router-link to="/">返回首页</router-link>
  </div>
</template>

<script>
export default {
  name: 'Test'
}
</script>

<style scoped>
.test {
  text-align: center;
  padding: 2rem;
}
</style>
