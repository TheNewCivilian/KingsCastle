<template>
  <div class="home">
    <div class="video-container">
      <video autoplay muted loop>
        <source src='../assets/kingscastle.mp4' type="video/webm" >
      </video>
    </div>
    <MainMenu />
    <SideCard />
  </div>
</template>

<script>
import SideCard from '../components/SideCard.vue';
import MainMenu from '../components/MainMenu.vue';

export default {
  components: { MainMenu, SideCard },
  name: 'Home',
};
</script>

<style lang="scss" scoped>
.home {
  height: fit-content;
}

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
