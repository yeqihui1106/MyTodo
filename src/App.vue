<template>
  <div id="app">
    <TodoTitle></TodoTitle>
    <router-view></router-view>
  </div>
</template>

<script>
import TodoTitle from './components/TodoTitle.vue';
export default {
  name: 'App',
  components: { TodoTitle }
}
</script>

<style>
body {
  background-color: #f5f7fa;
}

.w {
  width: 660px;
  margin: 0 auto;
  background-color: #f5f7fa;
}

* {
  margin: 0;
  padding: 0;
}
</style>
