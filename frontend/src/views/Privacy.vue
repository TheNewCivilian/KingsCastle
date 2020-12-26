<template>
  <div class="privacy">
    <div v-html="content" class="privacy__container" />
  </div>
</template>

<script>
import marked from 'marked';

const privacyMd = require('../assets/Privacy.md');

export default {
  computed: {
    content() {
      return marked(privacyMd, { sanitize: true });
    },
  },
};
</script>

<style lang="scss" >
.privacy{
  position: relative;
  margin: 0 auto;
  max-width: 90%;
  display: flex;
  width:100%;
  flex-direction: column;
  justify-items: center;
  align-items: center;
  text-align: left;
  font-size: 12px;
}
</style>
