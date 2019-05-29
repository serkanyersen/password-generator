<template>
  <div class="Form">

    <button class="btn reload" @click="generate">
      Regenerate Password
    </button>
    <div class="switcher" @click="changeType">
      <button class="btn" value="password" :class="{ 'active': selected == 'password' }">
        Password
      </button>
      <button class="btn" value="pin" :class="{ 'active': selected == 'pin' }">PIN</button>
    </div>
    <div
      class="output password"
      :class="{[`score-${analysis.score}`]: true}"
      ref="output"
      @click="copy"
      v-html="password"
    ></div>

    <!-- <input type="text" ref="output" v-model="passwordRaw" > -->

    <div class="sliders">
      <label>
        Length
        <vue-slider
          v-model="length"
          :min="2"
          :max="64"
          :tooltip="'always'"
          :tooltip-placement="'bottom'"
          @change="generate"
        ></vue-slider>
      </label>
      <label v-show="selected !== 'pin'">
        Numbers
        <vue-slider
          v-model="numbers"
          :max="10"
          :tooltip="'always'"
          :tooltip-placement="'bottom'"
          @change="generate"
        ></vue-slider>
      </label>
      <label v-show="selected !== 'pin'">
        Symbols
        <vue-slider
          v-model="symbols"
          :max="10"
          :tooltip="'always'"
          :tooltip-placement="'bottom'"
          @change="generate"
        ></vue-slider>
      </label>
      <label class="ambiguous" v-show="selected !== 'pin'">
        <span>Avoid ambigious characters</span>
        <input type="checkbox" v-model="ambiguous" @change="generate">
      </label>
    </div>
    <div class="history">
      <h3>History <button class="btn" @click="clearHistory">Clear</button></h3>
      <div
        class="password"
        v-for="pass in history"
        :key="pass"
        v-html="pass"
        @click="copy"
      ></div>
    </div>
  </div>
</template>

<script>
import _ from 'lodash';
import VueSlider from 'vue-slider-component';
import 'vue-slider-component/theme/default.css';
import zxcvbn from 'zxcvbn';

function getSafe(name, defaultVal) {
  try {
    const value = localStorage.getItem(name);
    return (value === null) ? defaultVal : JSON.parse(value);
  } catch (e) {
    return defaultVal;
  }
}

function setSafe(name, value) {
  try {
    localStorage.setItem(name, JSON.stringify(value));
  // eslint-disable-next-line no-empty
  } catch (e) {}
}

export default {
  name: 'Form',
  components: {
    VueSlider,
  },
  data() {
    return {
      history: getSafe('history', []),
      selected: 'password',
      length: 10,
      numbers: 1,
      symbols: 1,
      password: '',
      analysis: {},
      ambiguous: true,
    };
  },
  mounted() {
    this.generate();
  },
  methods: {
    clearHistory() {
      this.history = [];
      setSafe('history', this.history);
    },
    changeType(e) {
      if (e.target.nodeName === 'BUTTON') {
        this.selected = e.target.value;
        this.generate();
      }
    },
    copy(e) {
      // this.$refs.output.select();
      document.execCommand('copy');

      if (!this.history.includes(this.password)
          && e.currentTarget.classList.contains('output')) {
        this.history.push(this.password);
        setSafe('history', this.history);
      }

      this.$toasted.show('Copied!', {
        theme: 'bubble',
        position: 'bottom-center',
        duration: 5000,
      });
    },
    generate() {
      let password = [];
      const chars = _.shuffle('abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ');
      const nums = '0123456789';
      const sign = '@#$%^&*-_|/<>![]{}().,`~=+?;';
      const achars = 'I1loO0';

      if (this.selected === 'pin') {
        _.times(this.length, () => {
          password.push(_.sample(nums));
        });
      } else {
        const charLength = Math.max(this.length - this.symbols - this.numbers, 0);

        _.times(charLength, () => password.push(_.sample(chars)));
        _.times(this.numbers, () => password.push(_.sample(nums)));
        _.times(this.symbols, () => password.push(_.sample(sign)));

        if (this.ambiguous) {
          password = password.map(c => (c === '0' || c === '1' ? _.random(2, 9) : c));
          password = password.map(c => (achars.includes(c) ? 'a' : c));
        }
      }

      const generated = _.sampleSize(_.shuffle(password), this.length);

      this.password = generated.map((char) => {
        let klass = 'char';

        if (nums.includes(char)) { klass = 'num'; }
        if (sign.includes(char)) { klass = 'sign'; }

        return `<span class="${klass}">${char}</span>`;
      }).join('');

      this.analysis = zxcvbn(generated.join(''));
      // this.passwordRaw = generated.join('');
    },
  },
};
</script>

<style lang="scss">
  .Form {
    display: grid;
    grid-template-areas: "output output"
                         "reload reload"
                         "sliders sliders";
    grid-template-columns: 1fr;
    grid-column-gap: 10px;
    grid-row-gap: 20px;

    .output {
      grid-area: output;
    }

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

    .btn {
      border: 2px solid #ccc;
      border-radius: 5px;
      background: #f5f5f5;
      color: #666;
      padding: 5px;
      font-size: 16px;
      outline: none;

      &:active {
        background: #ccc;
      }

      &.active {
        background: #dcdcdc;
      }
    }

    .reload {
      grid-area: reload;
      grid-column-end: 1;
    }

    .switcher {
      grid-area: reload;
      grid-column-start: 2;

      .btn:nth-child(1) {
        border-right: 0;
        border-radius: 5px 0 0 5px
      }

      .btn:nth-child(2) {
        border-radius: 0 5px 5px 0
      }
    }

    .history {
      display: grid;
      grid-row-gap: 10px;
      grid-column-start: 1;
      grid-column-end: 3;
    }

    .sliders {
      display: grid;
      grid-area: sliders;
      grid-row-gap: 30px;
    }
    .ambiguous {
      margin-top: 10px;
      font-size: 20px;
      display: flex;
      align-items: baseline;

      input {
        height: 20px;
        width: 20px;
      }
    }
    .char {color: gray;}
    .num {color: #67B3FB;}
    .sign {color: #FE8168;}
    .score-0 { border-color: #ff5b00; }
    .score-1 { border-color: #bda50a; }
    .score-2 { border-color: #c7b608; }
    .score-3 { border-color: #1e9e1e; }
    .score-4 { border-color: #00ad00; }
  }

</style>
