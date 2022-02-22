<template>
  <div class="page-container">
    <div class="container">
      <div class="footer-container">
        <span
          class="imprint"
          @click="imprintShown = true"
        >
          Imprint - About -
        </span>
        <router-link to='privacy' class="imprint"> Privacy Policy </router-link>
      </div>
    </div>
    <Imprint
      :closeCallback="() => imprintShown = false"
      v-if="imprintShown"
    />
  </div>
</template>

<script>
import Imprint from './Imprint.vue';

export default {
  components: {
    Imprint,
  },
  data: () => ({
    imprintShown: false,
  }),
};
</script>

<style lang="scss" scoped>
.page-container {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  pointer-events: none;
}

.container {
  position: absolute;
  display: flex;
  flex-direction: column;
  left: 0px;
  bottom: 0px;
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

@media only screen and (max-width: 700px) {
  .page-container {
    position: relative;
    margin: 10px auto;
  }
  .container {
    position: relative;
    margin: 10px auto;
  }
}

.subtitle {
  display: flex;
  align-items: center;
  font-size: 40px;
  margin-bottom: 10px;
}

.description {
  color: gray;

  &__heighlight {
    color: #2c3e50;
  }
}

.spacer {
  margin: 0 10px;
}

.affiliate {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: #FF8C42;
  width: fit-content;
  font-family: 'Balsamiq Sans', cursive;
  color: white;
  border-radius: 10px;
  border: none;
  box-shadow: 0px 0px 11px -2px rgba(0,0,0,0.2);
  padding: 5px 10px;
  margin-top: 10px;
  cursor: pointer;
  text-decoration: none;
}

.footer-container {
  margin-top: 5px;
}

.imprint {
  font-size: 14px;
  color: gray;
  cursor: pointer;
}
</style>
