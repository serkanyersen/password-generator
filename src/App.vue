<template>
  <div id="app">
    <home />

    <footer>
      <div>
        Serkan Yersen - <a href="http://serkan.io">serkan.io</a>
      </div>
      <div>
        Icons made by <a href="https://www.flaticon.com/authors/wichaiwi" title="Wichai.wi">Wichai.wi</a> from
        <a href="https://www.flaticon.com/" title="Flaticon">www.flaticon.com</a>
        is licensed by <a href="http://creativecommons.org/licenses/by/3.0/"
        title="Creative Commons BY 3.0" target="_blank">CC 3.0 BY</a>
      </div>
    </footer>
  </div>
</template>

<script>
import Home from './views/Home.vue';

export default {
  components: {
    Home,
  },
};
</script>


<style lang="scss">
html, body {
  height: 100%;
  width: 100%;
  margin: 0;
  padding: 0;
}

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
  grid-template-rows: 11fr 1fr;
  height: 100%;
  @media only screen and (max-width: 768px) {
    grid-template-columns: 0.5fr 11fr 0.5fr;
  }
}

footer {
  grid-row-start: 2;
  grid-column-start: 1;
  grid-column-end: 4;
  font-size: 12px;
  color: #666;
  vertical-align: bottom;
  display: flex;
  justify-content: flex-end;
  flex-direction: column;
  text-align: center;
  padding: 10px;

  a {
    color: #2c3e50;
  }
}

</style>
