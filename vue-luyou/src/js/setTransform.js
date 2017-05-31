(function (window) {
  window.transformCss = function (dom, name, value) {
    if (!dom.transform) {
      dom.transform = {}
    }
    

    if (arguments.length > 2) {
      //写
      dom.transform[name] = value
      var result = ''

      for (var item in dom.transform) {

        switch (item) {
          case 'rotate':
          case 'rotateZ':
          case 'skew':
          case 'skewX':
          case 'skewY':
          case 'skewZ':
            result += item + '(' + dom.transform[item] + 'deg) '
            break
          case 'scale':
          case 'scaleX':
          case 'scaleY':
          case 'scaleZ':
            result += item + '(' + dom.transform[item] + ') '
            break
          case 'translate':
          case 'translateX':
          case 'translateY':
          case 'translateZ':
            result += item + '(' + dom.transform[item] + 'px) '
            break
        }
      }

      dom.style.transform = result

    } else {
      //读

      if (typeof dom.transform[name] == 'undefined') {
        //默认值
        if (name == 'scale' || name == 'scaleX' || name == 'scaleY') {
          value = 1
        } else {
          value = 0
        }
      } else {
        value = dom.transform[name]
      }

      return value
    }

  }
  window.drag = function (navWrap, callback) {
    var navs_ul = navWrap.children[0]
    //简单的拖拽
    var startY = 0
    var eleY = 0
    var minY = navWrap.offsetHeight - navs_ul.offsetHeight
    //定义时间和位移
    var beginTime = 0
    var beginY = 0
    var endTime = 0
    var endY = 0

    var disVal = 0

    //抖动
    var startX = 0
    var isFirst = true
    var isY = true

    var Tween = {
      //默认样式
      Linear: function (t, b, c, d) {
        return c * t / d + b
      },
      //超出
      easeOut: function (t, b, c, d, s) {
        if (s == undefined) s = 1.70158
        return c * ((t = t / d - 1) * t * ((s + 1) * t + s) + 1) + b
      }
    }

    //定时器
    //var timer = 0
    navWrap.addEventListener('touchstart', function (ev) {
      var touch = ev.changedTouches[0]
      minY = navWrap.offsetHeight - navs_ul.offsetHeight
      //清除定时器
      clearInterval(navWrap.timer)
      //清除过渡
      navs_ul.style.transition = 'none'
      startY = touch.clientY
      eleY = transformCss(navs_ul, 'translateY')
      startX = touch.clientX
      //开始的速度和时间
      //毫秒
      beginTime = new Date().getTime()
      beginY = startY
      disVal = 0
      if (callback && callback['start']) {
        callback['start']()
      }
      isFirst = true
      isY = true
    })
    navWrap.addEventListener('touchmove', function (ev) {
      var touch = ev.changedTouches[0]
      //看门狗
      if (!isY) {
        return
      }
      var nowY = touch.clientY
      var disY = nowY - startY
      //范围的限定
      var translateY = disY + eleY
      var nowX = touch.clientX
      var disX = nowX - startX
      if (isFirst) {
        isFirst = false
        if (Math.abs(disX) > Math.abs(disY)) {
          isY = false
        }
      }
      //拖拽中拖的过程
      var scale = 0
      if (translateY > 0) {
        scale = 1 - translateY / document.documentElement.clientHeight
        translateY = translateY * scale
      } else if (translateY < minY) {
        //留白
        var over = minY - translateY
        scale = 1 - over / document.documentElement.clientHeight
        translateY = minY - (over * scale)
      }
      transformCss(navs_ul, 'translateY', translateY)
      //最后的速度和时间
      endTime = new Date().getTime()
      endY = nowY
      disTime = endTime - beginTime
      disVal = endY - beginY
      if (callback && callback['move']) {
        callback['move']()
      }
    })
    //快速滑屏和回弹效果
    navWrap.addEventListener('touchend', function (ev) {
      //快速滑屏的速度
      var speed = disVal / (endTime - beginTime)
      var target = transformCss(navs_ul, 'translateY') + speed * 80
      //速度越快speed值增大，回弹越快，相对时间减小
      var time = Math.abs(speed) * 0.3
      time = time > 0.3 ? 0.3 : time
      //限定范围
      var type = 'Linear'
      if (target > 0) {
        console.log('get in')
        target = 0
        type = 'easeOut'
      } else if (target < minY) {
        target = minY
        type = 'easeOut'
      }
      move(time, target, type)
      if (callback && callback['over']) {
        callback['over']()
      }
    })

    function move(time, target, type) {
      var t = 0
      var b = transformCss(navs_ul, 'translateY')
      var c = target - b
      //总次数
      var d = time / 0.02
      //var s = 2
      //每一个分步的距离
      clearInterval(navWrap.timer)
      navWrap.timer = setInterval(function () {
        t++
        if (t > d) {
          if (callback && callback['end']) {
            callback['end']()
          }
          //清除定时器
          clearInterval(navWrap.timer)
        } else {
          if (callback && callback['move']) {
            callback['move']()
          }
          //返回值：每次运动需要达到的距离
          var point = Tween[type](t, b, c, d)
          transformCss(navs_ul, 'translateY', point)
        }
      }, 20)
    }
  }
})(window)