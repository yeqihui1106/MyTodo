<template>
  <div>
    <div class="title"><img src="../../public/qianshanwanshui.png" alt=""></div>
    <div id="globe" style="width: 312px; height: 312px;"></div>
  </div>
</template>

<script>
// 按需引入
import * as echarts from 'echarts/core';
import { CanvasRenderer } from 'echarts/renderers';
import { GlobeComponent } from 'echarts-gl/components';
echarts.use([GlobeComponent, CanvasRenderer]);
import globeImage from '../assets/globe.jpg';
export default {
  mounted() {
    let chartDom = document.getElementById('globe')
    let myChart = echarts.init(chartDom);
    let option = {
      backgroundColor: 'rgba(0,0,0,0)',
      globe: {
        width: "312px",
        height: "312px",
        baseTexture: globeImage,
        shading: 'lambert',
        // environment: 'rgba(0, 0, 0, 0)',
        atmosphere: {
          show: true,
          color: "#000",
        },
        light: {
          ambient: {
            intensity: .7
          },
          main: {
            intensity: 0.7,
            shadow: true,
            shadowQuality: "ultra"
          },
        }
      },
    };
    option && myChart.setOption(option);
  }
}
</script>
<style scoped>
.title {
  position: absolute;
  left: 50px;
  top: 100px;
}

#globe {
  position: absolute;
  top: 190px;
  left: 50px;
}
</style>
