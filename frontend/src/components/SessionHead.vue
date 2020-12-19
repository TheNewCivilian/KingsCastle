<template>
  <div class="page-container">
    <div class="wrapper">
      <button class="surrender" @click="surrender">
        <FlagOutlineIcon />
        <span>Surrender</span>
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
import ws from '../api/ws';

export default {
  components: {
    FlagOutlineIcon,
  },
  computed: {
    userAUsername() {
      const { userA } = this.$store.getters;
      return userA && userA.username ? userA.username : 'Waiting...';
    },
    userBUsername() {
      const { userB } = this.$store.getters;
      return userB && userB.username ? userB.username : 'Waiting...';
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
      const { spectators } = this.$store.getters;
      if (spectators.length === 1) {
        return `${spectators[0].username} is watching the match.`;
      }
      if (spectators.length >= 1) {
        return `${spectators[0].username} and ${spectators.length - 1} other are watching the match.`;
      }
      return '';
    },
  },
  methods: {
    surrender() {
      ws.sendSurrender(this.$socket);
    },
  },
};
</script>

<style lang="scss" scoped>
  .surrender {
    display: flex;
    margin-left: 10px;
    align-items: center;
    justify-content: center;
    background-color: white;
    border: none;
    border-radius: 30px;
    max-height: 50px;
    padding: 15px;
    border: 1px solid rgb(201, 201, 201);
    box-shadow: 0px 0px 11px -2px rgba(0,0,0,0.2);
  }
  .page-container {
    position: absolute;
    top: 10px;
    left: 0px;
    width: 100%;
    display: flex;
    justify-content: space-between;
  }

  @media screen and (max-width: 1000px) {
    .page-container {
      top: 0px;
      flex-direction: column;
      align-items: center;
    }
    .surrender {
      padding: 5px 15px;
      margin: 5px;
    }
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
    max-height: 25px;
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
