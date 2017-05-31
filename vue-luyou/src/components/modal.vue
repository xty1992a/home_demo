<template>
  <div class="mask" @click="hide">
    <div class="bottom" @click.stop @done="test">
      <slot></slot>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'modal',
    data () {
      return {}
    },
    methods: {
      hide () {
        console.log('hide')
        this.$emit('hide')
      },
      test (index) {
        console.log(index, 'modal')
      }
    }
  }
</script>

<style rel="stylesheet/less" lang="less">
  .mask{
    background-color: rgba(0,0,0,.5);
    position: fixed;
    bottom: 0;
    right: 0;
    left: 0;
    top: 0;
    .bottom{
      position: absolute;
      width: 100%;
      bottom: 0;
    }
  }
</style>
