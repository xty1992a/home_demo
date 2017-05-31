<template>
  <div class="wrap" ref="wrap">
    <ul class="pic_list" ref="list">
      <li v-for="index in 5">{{index}}
        <!--<img src="" alt="">-->
      </li>
    </ul>
  </div>
</template>

<script>
  export default {
    name: '',
    data () {
      return {}
    },
    methods: {
      banner () {
        const screenW = document.documentElement.clientWidth
        const setTransform = window.setTransform
        const wrap = this.$refs.wrap
        let list = this.$refs.list
        const lis = list.children
        let isFirst = true
        let elementX = 0
        let counter = 0
        let startX = 0
        let startY = 0
        let isX = true
        let timer = 0
        list.innerHTML += list.innerHTML

        // 根据图片数量动态设置ul宽度.
        const css = document.createElement('style')
        let cssStr = '.pic_list{width:' + lis.length + '00%;}\n'
        cssStr += '.pic_list li{width:' + (1 / lis.length * 100) + '%;}\n'
        cssStr += '.wrap{height:' + lis[0].offsetHeight + 'px;}\n'
        css.innerHTML = cssStr
        document.head.appendChild(css)
        // 获取元素初始位置信息.
        wrap.addEventListener('touchstart', function (ev) {
          clearInterval(timer)
          let touch = ev.changedTouches[0]
          startX = touch.clientX
          startY = touch.clientY
          list.style.transition = 'none'
          counter = counter === 0 ? lis.length / 2 : counter
          counter = counter === lis.length - 1 ? lis.length / 2 - 1 : counter
          setTransform(list, 'translateX', -counter * screenW)
          setTransform(list, 'translateZ', '.00001')
          elementX = setTransform(list, 'translateX')
          isFirst = true
          isX = true
        })
        // 设置元素拖拽行为.
        wrap.addEventListener('touchmove', function (ev) {
          if (!isX) {
            return
          }
          let touch = ev.changedTouches[0]
          let currentX = touch.clientX
          let currentY = touch.clientY
          let gapX = currentX - startX
          let gapY = currentY - startY

          if (isFirst) {
            isFirst = false
            if (Math.abs(gapY) > Math.abs(gapX)) {
              isX = false
              return
            }
          }
          setTransform(list, 'translateX', gapX + elementX)
        })
        // 根据图片容器的偏移量,获知当前图片下标,根据下标重新设置图片偏移量(取整,完整显示图片)
        wrap.addEventListener('touchend', function () {
          list.style.transition = '.5s'
          counter = Math.round(-setTransform(list, 'translateX') / screenW)
          counter = counter > lis.length - 1 ? lis.length - 1 : counter
          counter = counter < 0 ? 0 : counter
          setTransform(list, 'translateX', -counter * screenW)
          setTransform(list, 'translateZ', '.0001')
          autoPlay()
        })
        // 自动轮播
        autoPlay()
        console.log(autoPlay)
        function autoPlay () {
          clearInterval(timer)
          timer = setInterval(function () {
            if (counter === lis.length - 1) {
              console.log(counter)
              counter = lis.length / 2 - 1
              console.log(counter, 'after')
              list.style.transition = 'none'
              setTransform(list, 'translateX', -counter * screenW)
              setTransform(list, 'translateZ', '.0001')
            }
            setTimeout(function () {
              counter++
              list.style.transition = '.5s'
              setTransform(list, 'translateX', -counter * screenW)
              setTransform(list, 'translateZ', '.0001')
            }, 20)
          }, 2000)
        }
      }
    },
    created () {
      this.$nextTick(() => {
        this.banner()
      })
    }
  }
</script>

<style rel="stylesheet/less" lang="less">
  .wrap {
    width: 100%;

    .pic_list {
      height: 100%;
      overflow: hidden;
      list-style: none;
      li {
        height: 100%;
        float: left;
        box-sizing: border-box;
        border: 1px solid;
        background-color: antiquewhite;
      }
    }
  }
</style>
