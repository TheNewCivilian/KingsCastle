<template>
  <div class="session">
    <Playground :points="[]"/>
    <SessionLobby sessionKey="21318" />
  </div>
</template>

<script>
import Playground from '../components/Playground.vue';
import SessionLobby from '../components/SessionLobby.vue';

export default {
  components: { Playground, SessionLobby },
};
</script>

<style lang="scss" scoped>
  .session {
    width: 100%;
    height: 100%;
  }
</style>
