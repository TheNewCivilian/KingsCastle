<template>
  <div class="session">
    <Playground />
    <SessionLobby v-if="!allUsersPresent" />
    <SessionHead />
    <ResultPopup v-if="finished" :success="winner"/>
  </div>
</template>

<script>
import Playground from '../components/Playground.vue';
import ResultPopup from '../components/ResultPopup.vue';
import SessionHead from '../components/SessionHead.vue';
import SessionLobby from '../components/SessionLobby.vue';

export default {
  components: {
    Playground,
    SessionHead,
    SessionLobby,
    ResultPopup,
  },
  computed: {
    joined() {
      return this.$store.getters.joined;
    },
    allUsersPresent() {
      return this.$store.getters.allUsersPresent;
    },
    finished() {
      return this.$store.getters.finished;
    },
    winner() {
      return this.$store.getters.winner;
    },
  },
  mounted() {
    if (!this.joined) {
      this.$router.push({ name: 'Lobby', params: { sessionId: this.$route.query.sid } });
    }
  },
};
</script>

<style lang="scss" scoped>
  .session {
    width: 100%;
    height: 100%;
  }
</style>
