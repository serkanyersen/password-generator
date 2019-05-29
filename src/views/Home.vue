<template>
  <div class="home">
    <h1>Password generator</h1>
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

<style>
.home {
  grid-column-start: 2;
}
</style>
