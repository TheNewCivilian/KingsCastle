<template>
  <div class="page-container">
    <div class="container">
      <button class="close" @click="closeCallback">
        <TimesIcon />
      </button>
      <span class="title">Imprint</span>
      <div class="row">
        <img src="../assets/david.png" class="profile"/>
      </div>
      <p class="description">
        Information in accordance with Art. 5 German Telemedia Act <br><br>

        Provider of all services under kingscastle.io is<br><br>

        David Prenninger<br>
        Rot-Kreuz-Straße 6<br>
        86179 Augsburg<br>
        Germany<br><br>

        E-Mail: info@prenninger.de
      </p>
    </div>
  </div>
</template>

<script>
import TimesIcon from 'vue-material-design-icons/Close.vue';

export default {
  props: {
    closeCallback: Function,
  },
  components: {
    TimesIcon,
  },
};
</script>

<style lang="scss" scoped>
  .close {
    position: absolute;
    right: 10px;
    top: 10px;
    background-color: transparent;
    border: none;
    color: #2c3e50;
  }
  .title {
    font-size: 40px;
    margin-bottom: 10px;
  }
  .page-container {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    pointer-events: all;
  }
  .container {
    position: absolute;
    display: flex;
    flex-direction: column;
    margin: calc(max(10px, 5%));
    background-color: white;
    box-shadow: 0px 0px 11px -2px rgba(0,0,0,0.2);
    border-radius: 10px;
    width: 300px;
    padding: 10px;
    box-sizing: border-box;
    align-items: center;
    justify-content: center;
    pointer-events: all;
  }
  .profile {
    height: 100px;
    border: 5px solid white;
    border-radius: 50%;
    box-shadow: 0px 0px 11px -2px rgba(0,0,0,0.2);
  }
</style>
