<template>
  <div class="img_wrap">
    <div id="wrap" @touchstart="start" @touchmove="move" @touchend="end">
      <ul id="cell" ref="cell">
        <li v-for="(url, index) in urlList" :key="index" class="card">
          <img :src="url" alt="">
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'carousel',
    props: {
      urlList: {
        type: Array,
        required: true
      }
    },
    data () {
      return {
        isMoving: false,
        timerID: 0,
        count: 0,
        startX: 0
      }
    },
    methods: {
      matrix (wrap) {
        var children = wrap.children
        var len = children.length
        console.log(len, children)
        children[0].children[0].onload = function () {
          var width = children[0].offsetWidth
          var toDeg = Math.PI / 180
          var jiajiao = 360 / len
          var neijiao = 180 - jiajiao
          var dis = Math.tan(neijiao / 2 * toDeg) * width / 2
          for (var i = 0; i < len; i++) {
            children[i].style.transform = 'rotateY(-' + (i * jiajiao) + 'deg) translateZ(' + dis + 'px)'
          }
        }
      },
      startShow () {
        this.isMoving = false
        this.timerID = this.autoPlay()
        this.$refs.cell.addEventListener('transitionend', () => {
          this.isMoving = false
          this.$refs.cell.style.transition = 'none'
        })
      },
      roll (rotate) {
        if (this.isMoving) return
        this.$refs.cell.style.transition = 'all 1s'
        this.$refs.cell.style.transform = 'rotateY(' + rotate + 'deg)'
      },
      autoPlay () {
        return setInterval(() => {
          this.isMoving = true
          this.count++
          this.count = this.count > this.urlList.length ? 0 : this.count
          this.roll(this.count)
        }, 2000)
      },
      start (ev) {
        console.log('start')
        window.clearInterval(this.timerID)
        this.$refs.cell.style.transition = 'none'
        console.log(this.timerID)
        let touch = ev.changedTouches[0]
        this.startX = touch.clientX
      },
      move (ev) {
        let touch = ev.changedTouches[0]
        let currentX = touch.clientX
        let gapX = currentX - this.startX
        let maxX = document.documentElement.clientWidth
        if (Math.abs(gapX) < maxX / 2) {
          if (gapX < 0) {
            this.count--
          } else {
            this.count++
          }
        }
        let scale = gapX / maxX
        this.rotate += scale * 1
        console.log(scale * 360, this.rotate)
        this.$refs.cell.style.transform = 'rotateY(' + this.rotate + 'deg)'
      },
      end () {
//        this.rotate = (this.count * 360 / this.urlList.length)
//        this.$refs.cell.style.transition = 'all 1s'
//        this.$refs.cell.style.transform = 'rotateY(' + this.rotate + 'deg)'

        this.timerID = this.autoPlay()
      }
    },
    created () {
      this.$nextTick(() => {
        console.log(this.$refs.cell)
        this.matrix(this.$refs.cell)
        console.log('start show')
        this.startShow()
      })
    },
    computed: {
      rotate () {
        return this.count * 360 / this.urlList.length
      }
    }
  }
</script>

<style rel="stylesheet/less" lang="less">
  @r: 32.5rem;
  #wrap {
    width: 325/@r;
    height: 173.3/@r;
    position: relative;
    margin: 0 auto;
    overflow: hidden;
    #cell {
      margin: 0;
      padding: 0;
      list-style: none;
      transform-style: preserve-3d;
      /*transition: all 1s;*/
      position: relative;
      /*transform: rotateX(30deg);*/
      height: 100%;
      width: 100%;
      .card {
        height: 100%;
        width: 100%;
        position: absolute;
        top: 0;
        left: 0;
        img {
          width: 100%;
        }
      }
    }
  }

</style>
