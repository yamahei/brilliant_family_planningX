<template>
  <p>
    <span class="example">({{ msg }})</span>
    abcdefg
  </p>
</template>
<script>
  export default {
    data() {
      return {
        msg: "world!",
        color: "blue",
      };
    },
  };
</script>
<style>
  body {
    color: "red";
  }
  .example {
    color: v-bind("color");
  }
</style>