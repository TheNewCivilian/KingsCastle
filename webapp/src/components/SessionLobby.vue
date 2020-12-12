<template>
  <div class="container">
    <span class="title">Waiting for oponent...</span>
    <span class="loader">
      <LoaderIcon :size="100"/>
    </span>
    <span class="title">Session Id:</span>
    <div class="row">
      <input type="text" ref="sessionId" id="sessionId" readonly :value="sessionId">
      <button class="copy-button" @click="copySessionKey">
        <CopyIcon />
      </button>
    </div>
  </div>
</template>

<script>
import CopyIcon from 'vue-material-design-icons/ContentCopy.vue';
import LoaderIcon from 'vue-material-design-icons/Loading.vue';

export default {
  components: {
    LoaderIcon,
    CopyIcon,
  },
  computed: {
    sessionId() {
      return this.$store.getters.sessionId;
    },
  },
  methods: {
    copySessionKey() {
      const copyText = this.$refs.sessionId;
      copyText.select();
      copyText.setSelectionRange(0, 99999);
      document.execCommand('copy');
    },
  },
};
</script>

<style lang="scss" scoped>
.title {
  font-size: 40px;
}
.loader {
  animation:spin 1s linear infinite;
}
@keyframes spin { 100% { -webkit-transform: rotate(360deg); transform:rotate(360deg); } }

.container {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(88, 88, 88, 0.418);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  z-index: 10;
}

#sessionId {
  text-align: center;
}

.row {
  display: flex;
  align-items: center;
}

.copy-button {
  padding: 10px 20px;
  box-sizing: border-box;
  font-size: 20px;
  color:  white;
  background-color: #FF8C42;
  border: none;
  border-radius: 10px;
  box-shadow: 0px 0px 11px -2px rgba(0,0,0,0.2);
  margin: 10px;
}
</style>
