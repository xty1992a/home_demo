<template>
  <div class="child">
    <slot>
      <h2>默认信息</h2>
    </slot>
    there is sbling component
    <p>{{msg}}</p>
  </div>
</template>

<script>
export default {
  name: 'sbling',
  data () {
    return {
    }
  },
  created () {
  },
  computed: {
    msg () {
      return this.$store.state.msg
    }
  }

}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.child{
  background-color: yellowgreen;
}
</style>
