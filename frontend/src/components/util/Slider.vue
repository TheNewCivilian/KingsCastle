<template>
  <div>
    <div class="slider-component">
      <div class="slidecontainer">
        <input
          ref="input"
          v-model="currentValue"
          type="range"
          :min="min"
          :max="max"
          class="slider"
          @input="onInput"
        >
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    value: {
      type: Number,
      required: true,
    },
    min: {
      type: Number,
      required: true,
    },
    max: {
      type: Number,
      required: true,
    },
  },
  data() {
    return {
      currentValue: this.value,
    };
  },
  methods: {
    onInput() {
      // this.currentValue is a string because HTML is weird
      this.$emit('input', parseInt(this.currentValue, 10));
    },
  },
};
</script>

<style lang="scss" scoped>
.slider-component .slidecontainer {
  width: 100%;
}

.slider-component .slidecontainer .slider {
  appearance: none;
  width: 100%;
  height: 4px;
  border-radius: 2px;
  background: #c2c2c2;
  outline: none;
  opacity: 0.7;
  transition: opacity .2s;
}

.slider-component .slidecontainer .slider:hover {
  opacity: 1;
}

.slider-component .slidecontainer .slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 18px;
  height: 18px;
  background: #FF8C42;
  cursor: pointer;
  border-radius: 50%;
  border: none;
  box-shadow: 0px 0px 11px -2px rgba(0,0,0,0.2);
}

.slider-component .slidecontainer .slider::-moz-range-thumb {
  width: 18px;
  height: 18px;
  background: #FF8C42;
  cursor: pointer;
  border-radius: 50%;
  border: none;
  box-shadow: 0px 0px 11px -2px rgba(0,0,0,0.2);
}
</style>
