<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<style lang="scss">
body {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  background: #f9f9f9;
}
#app {
  display: grid;
  grid-template-columns: 4fr 4fr 4fr;
  @media only screen and (max-width: 768px) {
    grid-template-columns: 0.5fr 11fr 0.5fr;
  }
}


</style>
