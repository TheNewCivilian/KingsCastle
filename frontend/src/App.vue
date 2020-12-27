<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
import WS from './api/ws';

export default {
  created() {
    this.$options.sockets.onmessage = this.onMessage;
  },
  methods: {
    onMessage(recievedMessage) {
      WS.onResponse(
        this.$route,
        this.$socket,
        this.$store,
        this.$router,
        recievedMessage,
      );
    },
  },
};
</script>

<style lang="scss">
body, html, #app {
  width: 100%;
  height: 100%;
  margin: 0;
  padding: 0;
  text-align: center;
  color: #2c3e50;
  font-family: 'Balsamiq Sans', cursive;
  overflow: auto;
}

button {
  cursor: pointer;
}

a {
  text-decoration: none;
  font-size: inherit;
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
  color: #000;
}

input[type=range] {
  padding: 0;
}

.button {
  margin-top: 10px;
  background-color: #48A9A6;
  border-radius: 10px;
  border: none;
  box-shadow: 0px 0px 11px -2px rgba(0,0,0,0.2);
  padding: 10px 20px;
  color: white;
  font-size: 20px;
  font-family: 'Balsamiq Sans', cursive;
  text-decoration: none;

  &__primary {
    background-color: #FF8C42;
  }
}

</style>
