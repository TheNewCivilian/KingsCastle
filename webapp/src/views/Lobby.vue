<template>
  <div class="home">
    <div class="video-container">
      <video autoplay muted loop>
        <source src='../assets/game_sample.webm' type="video/webm" >
      </video>
    </div>
    <div class="container">
      <span class="title">
        <span class="title--orange">Kings</span>Castle.io
      </span>
      <div class="section">
        <label for="username_input" class="subtitle">
          Username
        </label>
        <input id="username_input" type="text"/>
      </div>
      <div class="section">
        <span class="subtitle">Host Game</span>
        <div class="row description">
          <span>Points:</span>
          <span>{{rounds}}</span>
        </div>
        <input type="range" min="100" max="1000" v-model="rounds">
        <div class="row">
          <label for="round_private" class="description">
            Private
          </label>
          <input id="round_private" type="checkbox"/>
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
  </div>
</template>

<script>
// @ is an alias to /src
// import HelloWorld from '@/components/HelloWorld.vue';

export default {
  name: 'Home',
  data: () => ({
    rounds: 100,
  }),
  // components: {
  //   HelloWorld,
  // },
};
</script>

<style lang="scss" scoped>

.video-container {
  position: absolute;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  z-index: -1;
}
.video-container > video {
  display: block;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  z-index: 1;
}
@media screen and (max-aspect-ratio: 1920/1080) {
  .video-container > video {
    height: 100%;
  }
}
@media screen and (min-aspect-ratio: 1920/1080) {
  .video-container > video {
    width: 100%;
  }
}

.row {
  display: flex;
  justify-content: space-between;
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
  margin-bottom: 10px;
  font-family: 'Balsamiq Sans', cursive;
}

.button {
  width: 50%;
  margin-left: auto;
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
