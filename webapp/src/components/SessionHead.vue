<template>
  <div class="page-container">
    <div class="wrapper">
      <button class="resign">
        <FlagOutlineIcon />
        <ArrowRightIcon />
        <EmoticonDeadOutlineIcon />
      </button>
    </div>
    <div class="wrapper wrapper--center">
      <div class="container">
        <span class="username">{{userAUsername}}</span>
        <span class="points">{{pointsA}}</span>
        <span class="pointsLeft">{{pointsLeft}}</span>
        <span class="points points--blue">{{pointsB}}</span>
        <span class="username">{{userBUsername}}</span>
      </div>
    </div>
    <span class="spectators">{{spectators}}</span>
  </div>
</template>

<script>
import FlagOutlineIcon from 'vue-material-design-icons/FlagOutline.vue';
import ArrowRightIcon from 'vue-material-design-icons/ArrowRight.vue';
import EmoticonDeadOutlineIcon from 'vue-material-design-icons/EmoticonDeadOutline.vue';

export default {
  components: {
    EmoticonDeadOutlineIcon,
    FlagOutlineIcon,
    ArrowRightIcon,
  },
  computed: {
    userAUsername() {
      const userA = this.$store.getters.userAUsername;
      return userA && userA !== '' ? userA : 'Waiting...';
    },
    userBUsername() {
      const userB = this.$store.getters.userBUsername;
      return userB && userB !== '' ? userB : 'Waiting...';
    },
    pointsA() {
      return this.$store.getters.pointsA;
    },
    pointsB() {
      return this.$store.getters.pointsB;
    },
    pointsLeft() {
      return this.$store.getters.pointsLeft;
    },
    spectators() {
      return '0';
    },
  },
};
</script>

<style lang="scss" scoped>
  .resign {
    display: flex;
    margin-left: 10px;
    align-items: center;
    justify-content: center;
    background-color: white;
    border: none;
    border-radius: 10px;
    border: 2px solid rgb(201, 201, 201);
    box-shadow: 0px 0px 11px -2px rgba(0,0,0,0.2);
  }
  .page-container{
    position: absolute;
    top: 10px;
    left: 0px;
    width: 100%;
    display: flex;
    justify-content: space-between;
  }
  .wrapper {
    flex: 1 1 0px;
    display: flex;
    justify-content: left;

    &--center {
      justify-content: center;
    }
  }
  .container {
    font-size: 20px;
    padding: 15px;
    background-color: white;
    border-radius: 30px;
    box-shadow: 0px 0px 11px -2px rgba(0,0,0,0.2);
  }

  .username {
    margin: 0 10px;
  }

  .points {
    color: #FF8C42;
    margin: 0 10px;

    &--blue {
      color: #48A9A6;
    }
  }

  .pointsLeft {
    padding: 0 10px;
    border-left: 1px solid gainsboro;
    border-right: 1px solid gainsboro;
  }

  .spectators {
    flex: 1 1 0px;
    text-align: right;
    color: grey;
    margin: 15px;
  }
</style>
