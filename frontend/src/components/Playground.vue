<template>
  <div
    class="playground"
    ref="playground"
    @mousemove="mouseMove"
    @touchstart="(e) => startTouch = e.touches"
    @touchmove="checkTouchMove"
  />
</template>

<script>
/* eslint-disable no-param-reassign */
import Two from 'two.js';
import ws from '../api/ws';

const isMobile = () => window.innerWidth <= 1000;

export default {
  data() {
    return {
      offsetX: window.innerWidth / 2,
      offsetY: window.innerHeight / 2,
      lastMouseX: 0,
      lastMouseY: 0,
      zoomLevel: 32,
      playerDot: null,
      two: null,
      startTouch: null,
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
      if (newValue && !isMobile()) {
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
    if (this.isPlayersTurn && !isMobile()) {
      this.two.add(this.playerDot);
    } else {
      this.two.remove(this.playerDot);
    }

    window.addEventListener('wheel', (e) => {
      this.applyZoom(e.deltaY);
    }, { passive: true });

    window.addEventListener('beforeunload', () => {
      ws.sendSurrender(this.$socket);
    });

    window.addEventListener('keydown', (e) => this.moveBoard(e));
    this.$refs.playground.addEventListener('mousedown', () => this.placePoint());
  },
  beforeDestroy() {
    ws.sendSurrender(this.$socket);
  },
  methods: {
    checkTouchMove(e) {
      // Zoom Gesture
      if (e.changedTouches.length === 2 && this.startTouch.length === 2) {
        const deltaX = e.changedTouches[0].pageX - this.startTouch[0].pageX;
        const deltaY = e.changedTouches[0].pageY - this.startTouch[0].pageY;
        let totalDelta = Math.sqrt(deltaX ** 2 + deltaY ** 2);
        if (deltaX > 0) {
          totalDelta = -totalDelta;
        }
        this.applyZoom(totalDelta / 2);
        this.startTouch = e.touches;
      }
      // Navigate
      if (e.changedTouches.length === 1 && this.startTouch.length === 1) {
        this.offsetX += e.changedTouches[0].pageX - this.startTouch[0].pageX;
        this.offsetY += e.changedTouches[0].pageY - this.startTouch[0].pageY;
        this.navigateBoard();
        this.startTouch = e.touches;
      }
      e.preventDefault();
    },
    mouseMove(e) {
      this.lastMouseX = e.clientX;
      this.lastMouseY = e.clientY;
      this.calculatePlayerPos();
    },
    navigateBoard() {
      if (this.$refs && this.$refs.playground) {
        this.dots.forEach((dot) => {
          if (!dot.visual) {
            dot.visual = this.two.makeCircle(0, 0, 5);
            if (dot.party === 'userA') {
              dot.visual.fill = '#fff';
              dot.visual.stroke = '#FF8C42';
              dot.visual.linewidth = 2;
            } else {
              dot.visual.fill = '#fff';
              dot.visual.stroke = '#48A9A6';
              dot.visual.linewidth = 2;
            }
          } else if (dot.party === 'userA') {
            dot.visual.fill = '#FCAF58';
          } else {
            dot.visual.fill = '#70C2BF';
          }
          if (dot.invalid) {
            dot.visual.fill = '#fff'; // eslint-disable-line no-param-reassign
          }
          dot.visual.radius = 5 * (this.zoomLevel / 32);
          this.calculatePointPos(dot.visual, dot.x, dot.y);
        });
        this.polygons.forEach((polygon) => {
          if (!polygon.visual) {
            const vertices = polygon.vertices.map(
              (routElement) => new Two.Vector(
                (routElement.x - polygon.vertices[0].x) * this.zoomLevel,
                (routElement.y - polygon.vertices[0].y) * this.zoomLevel,
              ),
            );
            polygon.visual = new Two.Path(vertices, true, false);
            this.two.add(polygon.visual);
            polygon.visual.stroke = polygon.party === 'userA' ? '#FF8C42' : '#48A9A6';
            polygon.visual.fill = 'transparent';
            polygon.visual.linewidth = 4;
          }
          polygon.visual.scale = (this.zoomLevel / 32);
          this.calculatePointPos(polygon.visual, polygon.x, polygon.y);
        });
        this.playerDot.radius = 5 * (this.zoomLevel / 32);
        const backgroundXOffset = Math.round(this.offsetX % this.zoomLevel);
        const backgroundYOffset = Math.round(this.offsetY % this.zoomLevel);
        this.$refs.playground.style.backgroundPositionX = `${backgroundXOffset}px`;
        this.$refs.playground.style.backgroundPositionY = `${backgroundYOffset}px`;
        this.$refs.playground.style.backgroundSize = `${this.zoomLevel}px`;
      }
    },
    placePoint() {
      if (this.isPlayersTurn) {
        const xPos = Math.floor((this.lastMouseX - this.offsetX) / this.zoomLevel);
        const yPos = Math.floor((this.lastMouseY - this.offsetY) / this.zoomLevel);
        ws.sendTurn(this.$socket, { xPos, yPos });
      }
    },
    calculatePlayerPos() {
      const xPos = Math.floor((this.lastMouseX - this.offsetX) / this.zoomLevel);
      const yPos = Math.floor((this.lastMouseY - this.offsetY) / this.zoomLevel);
      this.calculatePointPos(this.playerDot, xPos, yPos);
    },
    calculatePointPos(dot, posX, posY) {
      const totalXPos = this.zoomLevel / 2 + this.offsetX + (posX * this.zoomLevel);
      const totalYPos = this.zoomLevel / 2 + this.offsetY + (posY * this.zoomLevel);
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
      this.offsetX += translationX;
      this.offsetY += translationY;
      this.navigateBoard();
      this.calculatePlayerPos();
    },
    applyZoom(value) {
      if (this.zoomLevel - value >= 8 && this.zoomLevel - value <= 64) {
        this.zoomLevel -= value;
        this.offsetX -= value;
        this.offsetY -= value;
        this.navigateBoard();
        this.calculatePlayerPos();
      }
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
