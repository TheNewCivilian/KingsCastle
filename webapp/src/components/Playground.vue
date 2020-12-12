<template>
  <div
    class="playground"
    ref="playground"
    @mousemove="mouseMove"
  />
</template>

<script>
import Two from 'two.js';

export default {
  data() {
    return {
      offsetX: 0,
      offsetY: 0,
      lastMouseX: 0,
      lastMouseY: 0,
      displayedDots: [],
      displayedPaths: [],
      playerDot: null,
      two: null,
    };
  },
  computed: {
    isPlayersTurn() {
      return this.$store.getters.isPlayersTurn;
    },
  },
  watch: {
    // TODO FIX Player shown
    isPlayersTurn(newValue) {
      console.log(newValue);
      if (newValue) {
        this.two.remove(this.playerDot);
      } else {
        this.two.add(this.playerDot);
      }
    },
  },
  mounted() {
    // Check if session exists
    // return to home
    console.log(this.$refs.playground);
    this.two = new Two({
      fullscreen: true,
      autostart: true,
    }).appendTo(this.$refs.playground);

    this.playerDot = this.two.makeCircle(0, 0, 5, 5);

    window.addEventListener('wheel', (e) => {
      const translationY = e.deltaY * 5;
      this.offsetY += translationY;
      this.navigateBoard();
      this.calculatePlayerPos();
    }, { passive: true });

    window.addEventListener('keydown', (e) => this.moveBoard(e));
    this.$refs.playground.addEventListener('mousedown', (e) => this.placePoint(e));
  },
  methods: {
    mouseMove(e) {
      this.lastMouseX = e.clientX;
      this.lastMouseY = e.clientY;
      this.calculatePlayerPos();
    },
    navigateBoard() {
      if (this.$refs && this.$refs.playground) {
        this.displayedDots.forEach((dot) => {
          if (dot.invalid) {
            dot.visual.fill = '#fff'; // eslint-disable-line no-param-reassign
          }
          this.calculatePointPos(dot.visual, dot.x, dot.y);
        });
        this.displayedPaths.forEach((path) => {
          this.calculatePointPos(path.visual, path.x, path.y);
        });
        // zero.translation.set(16 + offsetX, 16 + offsetY);
        const backgroundXOffset = Math.round(this.offsetX % 32);
        const backgroundYOffset = Math.round(this.offsetY % 32);
        this.$refs.playground.style.backgroundPositionX = `${backgroundXOffset}px`;
        this.$refs.playground.style.backgroundPositionY = `${backgroundYOffset}px`;
      }
    },
    placePoint() {

    },
    calculatePlayerPos() {
      const xPos = Math.floor((this.lastMouseX - this.offsetX) / 32);
      const yPos = Math.floor((this.lastMouseY - this.offsetY) / 32);
      this.calculatePointPos(this.playerDot, xPos, yPos);
    },
    calculatePointPos(dot, posX, posY) {
      const totalXPos = 16 + this.offsetX + (posX * 32);
      const totalYPos = 16 + this.offsetY + (posY * 32);
      dot.translation.set(totalXPos, totalYPos);
    },
    moveBoard(e) {
      let translationY = 0;
      let translationX = 0;
      switch (e.code) {
        case 'ArrowUp':
        case 'KeyW':
          translationY += 8;
          break;
        case 'ArrowDown':
        case 'KeyS':
          translationY -= 8;
          break;
        case 'ArrowLeft':
        case 'KeyA':
          translationX += 8;
          break;
        case 'ArrowRight':
        case 'KeyD':
          translationX -= 8;
          break;
        default:
          console.log(e);
      }
      this.offsetX -= translationX;
      this.offsetY -= translationY;
      this.navigateBoard();
      this.calculatePlayerPos();
    },
  },
};
</script>

<style lang="scss" scoped>
.playground {
  width: 100%;
  height: 100%;
  background-image: url(../assets/dots.png);
  background-repeat: repeat;
}
</style>
