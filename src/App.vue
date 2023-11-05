<template>
  <RouterLink to="/login" v-if="!shouldShowLink" > login </RouterLink>
  <RouterLink to="/register" v-if="!shouldShowLink" > register </RouterLink>
  <RouterView></RouterView>
</template>

<script>
export default {
  name: 'App',
  computed: {
    shouldShowLink() {
      return this.$route.path !== '/';
    },
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
