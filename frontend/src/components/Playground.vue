<template>
  <div
    class="playground"
    ref="playground"
    @mousemove="mouseMove"
  />
</template>

<script>
/* eslint-disable no-param-reassign */
import Two from 'two.js';
import ws from '../api/ws';

export default {
  data() {
    return {
      offsetX: 0,
      offsetY: 0,
      lastMouseX: 0,
      lastMouseY: 0,
      playerDot: null,
      two: null,
    };
  },
  computed: {
    isPlayersTurn() {
      return this.$store.getters.isPlayersTurn;
    },
    dots() {
      return this.$store.getters.dots;
    },
    polygons() {
      return this.$store.getters.polygons;
    },
  },
  watch: {
    // TODO FIX Player shown
    isPlayersTurn(newValue) {
      if (newValue) {
        this.two.add(this.playerDot);
      } else {
        this.two.remove(this.playerDot);
      }
    },
    dots() {
      this.navigateBoard();
    },
  },
  mounted() {
    this.two = new Two({
      fullscreen: true,
      autostart: true,
    }).appendTo(this.$refs.playground);

    this.playerDot = this.two.makeCircle(0, 0, 5, 5);
    if (this.isPlayersTurn) {
      this.two.add(this.playerDot);
    } else {
      this.two.remove(this.playerDot);
    }

    window.addEventListener('wheel', (e) => {
      const translationY = e.deltaY;
      this.offsetY += translationY;
      this.navigateBoard();
      this.calculatePlayerPos();
    }, { passive: true });

    window.addEventListener('keydown', (e) => this.moveBoard(e));
    this.$refs.playground.addEventListener('mousedown', () => this.placePoint());
  },
  methods: {
    mouseMove(e) {
      this.lastMouseX = e.clientX;
      this.lastMouseY = e.clientY;
      this.calculatePlayerPos();
    },
    navigateBoard() {
      if (this.$refs && this.$refs.playground) {
        this.dots.forEach((dot) => {
          if (!dot.visual) {
            dot.visual = this.two.makeCircle(0, 0, 5, 5);
            if (dot.party === 'userA') {
              dot.visual.fill = '#FCAF58';
              dot.visual.stroke = '#FF8C42';
              dot.visual.linewidth = 2;
            } else {
              dot.visual.fill = '#70C2BF';
              dot.visual.stroke = '#48A9A6';
              dot.visual.linewidth = 2;
            }
          }
          if (dot.invalid) {
            dot.visual.fill = '#fff'; // eslint-disable-line no-param-reassign
          }
          this.calculatePointPos(dot.visual, dot.x, dot.y);
        });
        this.polygons.forEach((polygon) => {
          if (!polygon.visual) {
            const vertices = polygon.vertices.map(
              (routElement) => new Two.Vector(
                (routElement.x - polygon.vertices[0].x) * 32,
                (routElement.y - polygon.vertices[0].y) * 32,
              ),
            );
            polygon.visual = new Two.Path(vertices, true, false);
            this.two.add(polygon.visual);
            polygon.visual.stroke = polygon.party === 'userA' ? '#FF8C42' : '#48A9A6';
            polygon.visual.fill = 'transparent';
            polygon.visual.linewidth = 4;
          }
          this.calculatePointPos(polygon.visual, polygon.x, polygon.y);
        });
        const backgroundXOffset = Math.round(this.offsetX % 32);
        const backgroundYOffset = Math.round(this.offsetY % 32);
        this.$refs.playground.style.backgroundPositionX = `${backgroundXOffset}px`;
        this.$refs.playground.style.backgroundPositionY = `${backgroundYOffset}px`;
      }
    },
    placePoint() {
      if (this.isPlayersTurn) {
        const xPos = Math.floor((this.lastMouseX - this.offsetX) / 32);
        const yPos = Math.floor((this.lastMouseY - this.offsetY) / 32);
        ws.sendTurn(this.$socket, { xPos, yPos });
      }
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
