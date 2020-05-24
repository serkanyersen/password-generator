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
    <password-field
      :password="password"
      :class="{[`score-${analysis.score}`]: true}"
      ref="output"
      class="output"
      @click.native="copy"
    />

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
      <label title="'I', '1', 'l', 'o', 'O', '0'" class="ambiguous" v-show="selected !== 'pin'">
        <span>Avoid ambigious characters</span>
        <input type="checkbox" v-model="ambiguous" @change="generate">
      </label>
    </div>
    <div class="history">
      <h3>History <button class="btn" @click="clearHistory">Clear</button></h3>
        <password-field
          v-for="(pass, index) in history"
          :key="index"
          :password="pass"
          @click.native="copy"
        />
      <!-- <div
        class="password"
        @click="copy">
        <span v-for="({type, value}, index) in pass" :class="type" :key="index" @click="copy">
          {{value}}
        </span>
      </div> -->


    </div>
  </div>
</template>

<script>
import _times from 'lodash-es/times';
import _sample from 'lodash-es/sample';
import VueSlider from 'vue-slider-component';
import 'vue-slider-component/theme/default.css';
import PasswordField from './PasswordField.vue';

const CHAR_TYPES = {
  CHARS: 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ',
  NUMS: '0123456789',
  SIGNS: '@#$%^&*-_|/<>![]{}().,`~=+?;',
  ACHARS: new Set(['I', '1', 'l', 'o', 'O', '0']),
};

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
    PasswordField,
  },
  data() {
    return {
      history: getSafe('history', []),
      selected: 'password',
      length: 10,
      numbers: 1,
      symbols: 1,
      password: [],
      analysis: {},
      ambiguous: true,
    };
  },
  mounted() {
    this.generate();
  },
  computed: {
    passwordSting() {
      return this.password.map(({ value }) => value).join('');
    },
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
      this.password = [];

      if (this.selected === 'pin') {
        _times(this.length, () => {
          this.password.push({ type: 'NUMS', value: _sample(CHAR_TYPES.NUMS) });
        });
      } else {
        const charLength = Math.max(this.length - this.symbols - this.numbers, 0);

        const picks = new Map([
          ['CHARS', charLength],
          ['NUMS', this.numbers],
          ['SIGNS', this.symbols],
        ]);

        picks.forEach((count, type) => {
          if (!count) {
            picks.delete(type);
          }
        });

        while (this.password.length !== this.length) {
          const type = _sample(Array.from(picks.keys()));
          const leftCount = picks.get(type);
          const value = _sample(CHAR_TYPES[type]);
          if (this.ambiguous && CHAR_TYPES.ACHARS.has(value)) {
            // eslint-disable-next-line no-continue
            continue;
          }
          this.password.push({ type, value });

          // eslint-disable-next-line no-unused-expressions
          leftCount === 1
            ? picks.delete(type)
            : picks.set(type, leftCount - 1);
        }
      }

      this.analysis = { score: 4 };
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
    .score-0 { border-color: #ff5b00; }
    .score-1 { border-color: #bda50a; }
    .score-2 { border-color: #c7b608; }
    .score-3 { border-color: #1e9e1e; }
    .score-4 { border-color: #00ad00; }
  }

</style>
