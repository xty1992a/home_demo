<template>
  <div class="hello">
    <carousel :url-list="urlList"></carousel>
    <child>
      <h2 slot="head">我希望能出现在child内部</h2>
      <h2 slot="body">body</h2>
    </child>
    <p class="time" @click="isShow=true">{{date}}</p>
    <sbling>
      <h2>我来自父组件</h2>
    </sbling>
    <!--<img-viewer></img-viewer>-->
    <transition name="modal">
      <modal v-show="isShow" @hide="isShow = false">
        <!--<timer></timer>-->
        <date-picker :init-date="date" @done="selecteTime"></date-picker>
      </modal>
    </transition>
    <calendar></calendar>
    <router-link to="/ball">前往小球动画</router-link>
  </div>
</template>

<script>
  import child from './child.vue'
  import sbling from './sbling.vue'
  import modal from './modal.vue'
  import timer from './timer.vue'
  import imgViewer from './img_viewer.vue'
  import datePicker from './date_picker.vue'
  import calendar from './calendar.vue'
  import carousel from './carousel/carousel.vue'

  export default {
    name: 'main',
    data () {
      return {
        isShow: false,
        date: '2017-5-20',
        urlList: []
      }
    },
    methods: {
      selecteTime (time) {
        this.isShow = false
        this.date = time
      },
      getUrl (num) {
        var result = []
        function getColor () {
          var num = parseInt(Math.random() * 16581375)
          return num.toString(16)
        }
        for (var i = 1; i <= num; i++) {
          result.push('https://dummyimage.com/750x400/' + getColor() + '/fff.png')
        }
        return result
      }
    },
    components: {
      child,
      sbling,
      modal,
      timer,
      imgViewer,
      carousel,
      calendar,
      datePicker
    },
    created () {
      this.urlList = this.getUrl(3)
      console.log(this.$store)
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style rel="stylesheet/less" lang="less">
  .hello {
    .time {
      color: #fff;
      padding: 30px;
      font-size: 40px;
      background-color: darkcyan;
    }
  }

  .modal-enter, .modal-leave-active {
    &.mask {
      opacity: 0;
      .bottom {
        transform: translateY(100%);
      }
    }
  }

  .modal-enter-active, .modal-leave-active {
    transition: .5s;
    &.mask {
      .bottom {
        transition: .5s;
      }
    }
  }

  .modal-leave {
    transition: 2s;
    &.mask {
      opacity: 1;
      .bottom {
        transform: translateY(0);
      }
    }
  }
</style>
