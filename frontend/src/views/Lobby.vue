<template>
  <div class="home">
    <div class="video-container">
      <!-- <video muted loop>
        <source src='../assets/game_sample.webm' type="video/webm" >
      </video> -->
    </div>
    <main-menu />
    <amazon-affiliate />
  </div>
</template>

<script>
import AmazonAffiliate from '../components/AmazonAffiliate.vue';
import MainMenu from '../components/MainMenu.vue';

export default {
  components: { MainMenu, AmazonAffiliate },
  name: 'Home',
};
</script>

<style lang="scss" scoped>

.video-container {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  z-index: -1;
  background-color: black;
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
</style>
