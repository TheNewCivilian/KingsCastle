<template>
  <div class="container">
    <span class="title">
      <span class="title--orange">Kings</span>Castle.io
    </span>
    <div class="section">
      <label for="username_input" class="subtitle">
        Username
      </label>
      <input id="username_input" type="text" v-model="username"/>
    </div>
    <div class="section">
      <span class="subtitle">Host Game</span>
      <div class="settings-container">
        <div class="row description">
          <span>Points:</span>
          <span>{{rounds}}</span>
        </div>
        <!-- <input type="range" min="100" max="1000" v-model="rounds"> -->
        <Slider :min="100" :max="1000" v-model="rounds"/>
      </div>
      <div class="row settings-container">
        <label for="round_private" class="description">
          Private
        </label>
        <Checkbox
          id="round_private"
          class="checkbox"
          type="checkbox"
          v-model="privateSession"
          color="#FF8C42"
        />
      </div>
      <button class="button button--orange">Host</button>
    </div>
    <div class="section">
      <span class="subtitle">Join Game</span>
      <span class="description">Join a randome game with no code.</span>
      <input id="username_session" type="text" placeholder="Session Code - XXXX"/>
      <button class="button">Join</button>
    </div>
  </div>
</template>

<script>
import Checkbox from 'vue-material-checkbox';
import usernames from '../assets/usernames.json';
import Slider from './util/Slider.vue';

const choose = (choices) => {
  const index = Math.floor(Math.random() * choices.length);
  return choices[index];
};

export default {
  components: {
    Slider,
    Checkbox,
  },
  data() {
    return {
      rounds: 100,
      privateSession: false,
      username: this.generateUsername(),
    };
  },
  methods: {
    generateUsername() {
      const name = `${choose(usernames.first)}${choose(usernames.second)}${Math.floor(Math.random() * 10)}`;
      console.log(name);
      return name;
    },
  },
};
</script>

<style lang="scss" scoped>
.row {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.settings-container {
  margin-top: 10px;
  border: 2px solid gainsboro;
  border-radius: 10px;
  padding: 5px;
}

.description {
  color: gray;
}

.container {
  position: absolute;
  display: flex;
  flex-direction: column;
  right: 0px;
  top: 0px;
  margin: calc(max(10px, 5%));
  background-color: white;
  box-shadow: 0px 0px 11px -2px rgba(0,0,0,0.2);
  border-radius: 10px;
  width: 300px;
}

@media only screen and (max-width: 700) {
  .container {
    right: auto;
    margin: 0 auto;
  }
}

.section {
  display: flex;
  text-align: left;
  flex-direction: column;
  border-top: 1px solid gainsboro;
  padding: 20px;
}

.title {
  font-size: 40px;
  margin: 20px;
  color: #48A9A6;

  &--orange {
    color: #FF8C42;
  }
}

.subtitle {
  font-size: 20px;
  margin-bottom: 10px;
}

input {
  font-family: 'Balsamiq Sans', cursive;
  padding: 12px 20px;
  box-sizing: border-box;
  font-size: 20px;
  color:  rgb(175, 175, 175);
}

input[type=text] {
  border: 2px solid gainsboro;
  border-radius: 10px;
}

#username_session {
  text-align: center;
}

.checkbox {
  width: 40px;
  margin: 0;
}

.button {
  width: 50%;
  margin-left: auto;
  margin-top: 10px;
  background-color: #48A9A6;
  border-radius: 10px;
  border: none;
  box-shadow: 0px 0px 11px -2px rgba(0,0,0,0.2);
  padding: 10px 0;
  color: white;
  font-size: 20px;
  font-family: 'Balsamiq Sans', cursive;

  &--orange {
    background-color: #FF8C42;
  }
}
</style>
