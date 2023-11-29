<template>
  <div>
    <div class="title"><img src="../../public/bufushaohua.png" alt=""></div>
    <div class="containerBox">
      <div class="line"></div>
      <div class="year"><span>{{ currentYear }}年</span></div>
      <div class="month">
        <span
          :style="{ '--rotateDeg': getRotateInfo(index, monthArr).rotateDeg, '--delayTime': getRotateInfo(index, monthArr).delayTime }"
          v-for="(item, index) in monthArr" :key="item">
          {{ item }}
        </span>
      </div>
      <div class="day">
        <span
          :style="{ '--rotateDeg': getRotateInfo(index, dayArr).rotateDeg, '--delayTime': getRotateInfo(index, dayArr).delayTime }"
          v-for="(item, index) in dayArr" :key="item">
          {{ item }}
        </span>
      </div>
      <div class="hour">
        <span
          :style="{ '--rotateDeg': getRotateInfo(index, hourArr).rotateDeg, '--delayTime': getRotateInfo(index, hourArr).delayTime }"
          v-for="(item, index) in hourArr" :key="item">
          {{ item }}
        </span>
      </div>
      <div class="minute">
        <span
          :style="{ '--rotateDeg': getRotateInfo(index, minuteArr).rotateDeg, '--delayTime': getRotateInfo(index, minuteArr).delayTime }"
          v-for="(item, index) in minuteArr" :key="item">
          {{ item }}
        </span>
      </div>
      <div class="second">
        <span
          :style="{ '--rotateDeg': getRotateInfo(index, secondArr).rotateDeg, '--delayTime': getRotateInfo(index, secondArr).delayTime }"
          v-for="(item, index) in secondArr" :key="item">
          {{ item }}
        </span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  // import引入的组件
  components: {},
  data() {
    return {
      // 获取当前年月日时分秒
      date: new Date(),
      // 共12个月
      monthArr: ["1月", "2月", "3月", "4月", "5月", "6月", "7月", "8月", "9月", "10月", "11月", "12月"],
      dayArr: ["1号", "2号", "3号", "4号", "5号", "6号", "7号", "8号", "9号", "10号", "11号", "12号", "13号", "14号", "15号", "16号", "17号", "18号", "19号", "20号", "21号", "22号", "23号", "24号", "25号", "26号", "27号", "28号", "29号", "30号", "31号"],
      hourArr: ["0时", "1时", "2时", "3时", "4时", "5时", "6时", "7时", "8时", "9时", "10时", "11时", "12时", "13时", "14时", "15时", "16时", "17时", "18时", "19时", "20时", "21时", "22时", "23时"],
      minuteArr: ["0分", "1分", "2分", "3分", "4分", "5分", "6分", "7分", "8分", "9分", "10分", "11分", "12分", "13分", "14分", "15分", "16分", "17分", "18分", "19分", "20分", "21分", "22分", "23分", "24分", "25分", "26分", "27分", "28分", "29分", "30分", "31分", "32分", "33分", "34分", "35分", "36分", "37分", "38分", "39分", "40分", "41分", "42分", "43分", "44分", "45分", "46分", "47分", "48分", "49分", "50分", "51分", "52分", "53分", "54分", "55分", "56分", "57分", "58分", "59分"],
      secondArr: ["0秒", "1秒", "2秒", "3秒", "4秒", "5秒", "6秒", "7秒", "8秒", "9秒", "10秒", "11秒", "12秒", "13秒", "14秒", "15秒", "16秒", "17秒", "18秒", "19秒", "20秒", "21秒", "22秒", "23秒", "24秒", "25秒", "26秒", "27秒", "28秒", "29秒", "30秒", "31秒", "32秒", "33秒", "34秒", "35秒", "36秒", "37秒", "38秒", "39秒", "40秒", "41秒", "42秒", "43秒", "44秒", "45秒", "46秒", "47秒", "48秒", "49秒", "50秒", "51秒", "52秒", "53秒", "54秒", "55秒", "56秒", "57秒", "58秒", "59秒"],
    }
  },
  computed: {
    currentYear() { return this.date.getFullYear() },
    currentMonth() { return this.date.getMonth() + 1 },
    currentDay() { return this.date.getDate() },
    currentHours() { return this.date.getHours() },
    currentMinutes() { return this.date.getMinutes() },
    currenttSeconds() { return this.date.getSeconds() },

    // 获取当前月有多少天 当我们将日期设置为0时，日期对象会回滚到上一个月,比如月份传入10，他会解析成11月，然后getDate则是10月的最后一天
    dayQuantity() { return new Date(this.currentYear, this.currentMonth, 0).getDate() },
  },
  //  方法集合
  methods: {
    // transition: "transform 0.5s"
    // 动态计算旋转度数和延迟时间
    getRotateInfo(index, whose) {
      // 计算旋转角度
      const rotateDeg = 360 / whose.length * index;
      // 计算延迟时间
      // const delayTime = (whose.length - index) * 0.1
      const delayTime = index * 0.02
      //  :style={这里动态设置属性}
      return { rotateDeg: `${rotateDeg}deg`, delayTime: `${delayTime}s` }
    },
  },
  // 生命周期-挂载完成（可以访问DOM元素）
  mounted() {
    this.dayArr = this.dayArr.slice(0, this.dayQuantity);
    const month = document.querySelector('.month')
    const day = document.querySelector('.day')
    const hour = document.querySelector('.hour')
    const minute = document.querySelector('.minute')
    const second = document.querySelector('.second')
    setTimeout(() => {
      month.classList.add('active')
    }, 0);
    setTimeout(() => {
      day.classList.add('active')
    }, this.monthArr.length * 20);
    setTimeout(() => {
      hour.classList.add('active')
      // 因为是要等到月和日旋转过渡完毕才执行，所以需要相加
    }, this.monthArr.length * 20 + this.dayArr.length * 20);

    setTimeout(() => {
      minute.classList.add('active')
    }, this.monthArr.length * 20 + this.dayArr.length * 20 + this.hourArr.length * 20);

    setTimeout(() => {
      second.classList.add('active')
    }, this.monthArr.length * 20 + this.dayArr.length * 20 + this.hourArr.length * 20 + this.minuteArr.length * 20);

    // 所有前序动画执行完毕，旋转至当前时间，然后继续旋转
    setTimeout(() => {
      // 最新的时间（因为前面执行前序动画需要时间）
      const currentDate = new Date();
      const monthTime = currentDate.getMonth() + 1;   // 获取当前月份（注意月份从0开始，所以要加1）
      const dayTime = currentDate.getDate();          // 获取当前日期
      const hourTime = currentDate.getHours();        // 获取当前小时
      const minuteTime = currentDate.getMinutes(); // 获取当前分钟
      const secondTime = currentDate.getSeconds(); // 获取当前秒钟

      // 1月不转，累加度数为30  1号不转，累加度数为360度/当前月的天数   0时不转，累加度数为15 ..........
      let monthAngle = (monthTime - 1) * 30;
      let dayAngle = (dayTime - 1) * 360 / this.dayQuantity;
      let hourAngle = hourTime * 15
      let minuteAngle = minuteTime * 6
      let secondAngle = secondTime * 6
      month.style.transform = `rotate(${monthAngle}deg)`
      day.style.transform = `rotate(${dayAngle}deg)`
      hour.style.transform = `rotate(${hourAngle}deg)`
      minute.style.transform = `rotate(${minuteAngle}deg)`
      second.style.transform = `rotate(${secondAngle}deg)`
      setTimeout(() => {
        document.querySelector(".line").style.opacity = 1;
      }, 500);
      // 循环定时器一直旋转即可
      setInterval(() => {
        secondAngle += 6;
        second.style.transform = `rotate(${secondAngle}deg)`;
        // 秒钟转一圈
        if (secondAngle % 360 == 0) {
          // 分钟加度数然后转一次
          minuteAngle += 6
          console.log(minuteAngle);
          minute.style.transform = `rotate(${minuteAngle}deg)`;
          // 分钟转一圈
          if (minuteAngle % 360 == 0) {
            // 小时加度数然后转一次
            hourAngle += 15
            hour.style.transform = `rotate(${hourAngle}deg)`;
            // 小时转一圈
            if (hourAngle % 360 == 0) {
              // 更新时间引起试图更新，否则可能天数不匹配了（比如2月最后一天最后一小时转完，应该重新的计算3月有多少天）
              this.date = new Date();
              // 天加度数然后转一次
              dayAngle += 360 / this.dayQuantity;
              day.style.transform = `rotate(${dayAngle}deg)`;
              // 天转一圈
              if (dayAngle % 360 == 0) {
                // 月加度数然后转一次
                monthAngle += 30
                month.style.transform = `rotate(${monthAngle}deg)`;
                // 月转一圈
                if (dayAngle % 360 == 0) {
                  // 新的一年（重新获取时间，vue应该自动更新视图）
                  this.date = new Date();
                }
              }
            }
          }
        }
      }, 1000);
    }, this.monthArr.length * 20 + this.dayArr.length * 20 + this.hourArr.length * 20 + this.minuteArr.length * 20 + this.secondArr.length * 20);
  }
}
</script>
<style scoped>
.title {
  position: absolute;
  right: 50px;
  top: 100px;
}

.containerBox {
  position: absolute;
  right: -110px;
  top: 30px;
  width: 650px;
  height: 650px;
  border-radius: 50%;
  /* border: 1px solid #000; */
  transform: scale(0.48);
}

.line {
  position: absolute;
  left: 50%;
  top: 50%;
  width: 336.5px;
  opacity: 0;
  transform: translate(-26.5px, 21px);
  height: 2px;
  background-color: #000;
}

.year,
.month,
.day,
.hour,
.minute,
.second {
  position: absolute;
  left: 50%;
  top: 50%;
  text-align: right;
  transform-origin: left top;
  transition: transform 0.5s;
}

.year {
  width: 53px;
  transform: translate(-50%, -50%);
  text-align: center;
}



.containerBox span {
  position: absolute;
  width: 100%;
  left: 0;
  transform-origin: left top;
  transform: rotate(0deg);
  white-space: nowrap;
  opacity: 0;
  transition: all 0.0001s ease var(--delayTime);
}


.month {
  width: 90px;
  transform-origin: left center;
}

.day {
  width: 160px;
}

.hour {
  width: 210px;
}

.minute {
  width: 260px;
}

.second {
  width: 310px;
}

.active span {
  opacity: 1;
  /* 逆时针旋转 */
  transform: rotate(calc(-1 * var(--rotateDeg)));
  /* 下面是顺时针 */
  /* transform: rotate(var(--rotateDeg)); */
}

.year span {
  opacity: 1;
}
</style>
