<template>
  <div class="time_wrap">
    i m time component
    <ul>
      <li v-for="index in 20" class="item" @click="check(index)">{{index}}</li>
    </ul>
  </div>
</template>

<script>
  export default {
    name: 'timer',
    data () {
      return {}
    },
    methods: {
      check (index) {
        console.log(index)
        this.$emit('time', index)
      }
    }
  }
</script>

<style rel="stylesheet/less" lang="less">
  @rem: 75rem;
  .time_wrap{
    background-color: yellowgreen;
    ul{
      list-style: none;
      margin: 0;
      padding: 0;
      overflow: hidden;
      .item{
        float: left;
        width: 75/@rem;
        text-align: center;
        color: #ffe7cc;
        font: 600 20px 'Microsoft YaHei';
        line-height: 75/@rem;
        height: 75/@rem;
      }
    }
  }
</style>
