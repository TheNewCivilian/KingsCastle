<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<style lang="scss">
body, html, #app {
  width: 100%;
  height: 100%;
  margin: 0;
  padding: 0;
  text-align: center;
  color: #2c3e50;
  font-family: 'Balsamiq Sans', cursive;
}

button {
  cursor: pointer;
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

</style>
