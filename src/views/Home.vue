<template>
  <div class="home">
    <h1>
      <img src="/img/icon.png" alt="logo" align="top" width="30px">
      Password Generator
    </h1>
    <generator-form></generator-form>
  </div>
</template>

<script>
import GeneratorForm from '../components/GeneratorForm.vue';

export default {
  name: 'home',
  components: {
    GeneratorForm,
  },
};
</script>

<style lang="scss">
.home {
  grid-column-start: 2;

  h1 {
    white-space: nowrap;
    font-size: 24px;
  }
}
</style>
