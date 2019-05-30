<template>
  <div class="password">
    <span v-for="({type, value}, index) in password" :class="type" :key="index">{{value}}</span>
  </div>
</template>

<script>
export default {
  name: 'password-field',
  props: {
    password: Array,
    default: [],
  },
};
</script>


<style lang="scss" scoped>
.password {
  font-family: courier;
  font-size: 16px;
  user-select: all;
  border: 2px solid #ccc;
  border-radius: 5px;
  background: #fff;
  overflow: hidden;
  white-space: nowrap;
  font-weight: bold;

  span {
    display: inline-block;
    padding: 10px 4px;
    border-right: 0.5px dashed #ccc;

    &::selection {
      color: rgba(0, 0, 0, 0.5);
    }

    &:nth-child(odd) {
      background: #f5f5f5;
    }
  }
}

.CHARS {color: gray;}
.NUMS {color: #67B3FB;}
.SIGNS {color: #FE8168;}
</style>
