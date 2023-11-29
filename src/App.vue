<template>
  <div id="app">
    <!-- <h1 class="timeTitle">不负韶华</h1> -->
    <!-- <h1 class="geographyTitle">千山万水</h1> -->
    <Globe></Globe>
    <CompassClock></CompassClock>
    <TodoTitle></TodoTitle>
    <router-view></router-view>
    <!-- <AppTwo></AppTwo> -->
  </div>
</template>

<script>
import TodoTitle from './components/TodoTitle.vue'
import CompassClock from './components/CompassClock'
import Globe from './components/3DGlobe.vue'
// import AppTwo from './components/AppTwo.vue'

export default {
  name: 'App',
  components: {
    TodoTitle,
    CompassClock,
    Globe
    // AppTwo

  },
}
</script>

<style>
body {
  background-color: #f5f7fa;
}

.w {
  width: 660px;
  margin: 0 auto;
}

* {
  margin: 0;
  padding: 0;
}

/* .timeTitle {
  position: absolute;
  right: 100px;
  top: 110px;
}

.geographyTitle {
  position: absolute;
  left: 100px;
  top: 110px;
} */
</style>
