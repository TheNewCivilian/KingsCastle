<template>
  <div class="overlay">
    <div class="container">
      <span class="title">
        {{success ? 'Congratulations!' : 'You have been beaten!'}}
      </span>
      <span class="icon">
        <PodiumGoldIcon v-if="success" :size="80"/>
        <ArmFlexOutlineIcon v-else :size="80"/>
      </span>
      <span class="message">
        {{success ? 'You won this match!' : 'Strong but not strong enought.'}}
      </span>
      <!-- <button>Share</button> -->
      <router-link class="button button__primary" to="/">Back to Lobby</router-link>
    </div>
  </div>
</template>

<script>
import PodiumGoldIcon from 'vue-material-design-icons/PodiumGold.vue';
import ArmFlexOutlineIcon from 'vue-material-design-icons/ArmFlexOutline.vue';

export default {
  props: {
    success: Boolean,
  },
  components: {
    PodiumGoldIcon,
    ArmFlexOutlineIcon,
  },
};
</script>

<style lang="scss" scoped>
  .overlay {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(104, 104, 104, 0.178);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 10;
  }

  .container {
    background-color: white;
    padding: 20px;
    display: flex;
    flex-direction: column;
    align-items: center;
    border-radius: 10px;
    box-shadow: 0px 0px 11px -2px rgba(0,0,0,0.2);
  }
  .title {
    font-size: 40px;
  }
</style>
