<template>
  <div class="child">
    <slot name="head"></slot>
    <slot name="body">
      默认内容
    </slot>
    there is child component
    <input type="text" v-model="msg" @change="change">
    <p>{{msg}}----{{count}}</p>
  </div>
</template>

<script>
  import {mapState} from 'vuex'
  export default {
    name: 'child',
    data () {
      return {
      }
    },
    methods: {
      change (ev) {
        var value = ev.target.value
        this.$store.commit('changeMsg', value)
        console.log(value)
      }
    },
    computed: mapState([
      'count',
      'msg'
    ]
//      {
//    count: 'count',
//    count2: state => state.count,
//    count3: function (state) {
//      return state.count
//    }
//  }
    )
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .child {
    background-color: #ff7be4;
  }
</style>
