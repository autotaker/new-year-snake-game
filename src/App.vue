<template>
  <section class="section">
    <div class="container">
      <h1 class="title is-3">2025スネークゲーム</h1>
      <p class="subtitle is-5">数字を食べてスコアを稼ごう！壁や自分の体に当たるとゲームオーバー！</p>
      <!-- ゲームコンポーネントを呼び出し -->
      <div class="game-panel">
        <div v-if="gameState === 'init'">
          <button class="button is-primary" @click="gameState = 'playing'">ゲームスタート</button>
        </div>
        <GameView v-else-if="gameState === 'playing'" @gameOver="handleGameOver" />
        <div v-else-if="gameState === 'gameover'">
          <p class="has-text-danger">ゲームオーバー</p>
          <p>{{ gameOverMessage }}</p>
          <button class="button is-primary" @click="gameState = 'playing'">もう一度プレイ</button>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import GameView from './components/GameView.vue'

const gameState = ref<'init' | 'playing' | 'gameover'>('init')
const gameOverMessage = ref<string>('')

const handleGameOver = (reason: string, score: number) => {
  gameState.value = 'gameover'
  gameOverMessage.value = `${reason} スコア: ${score}`
}
</script>

<style scoped>
.game-panel {
  text-align: center;
  margin-top: 20px;
  min-height: 400px;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
