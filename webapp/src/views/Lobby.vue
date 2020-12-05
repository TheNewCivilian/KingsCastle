<template>
  <div class="home">
    <video autoplay muted loop>
      <source src='background.mp4' type="video/mp4" >
    </video>
    <div>

    </div>
  </div>
</template>

<script>
// @ is an alias to /src
import HelloWorld from '@/components/HelloWorld.vue';

export default {
  name: 'Home',
  components: {
    HelloWorld,
  },
};
</script>
