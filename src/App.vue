<template>
  <section class="section">
    <div class="container">
      <h1 class="title is-3">2025スネークゲーム</h1>
      <p class="subtitle is-5">数字を食べてスコアを稼ごう！壁や自分の体に当たるとゲームオーバー！</p>
      <!-- ゲームコンポーネントを呼び出し -->
      <div class="game-panel">
        <GameView :gameId="gameId" @gameOver="handleGameOver" />
        <div class="game-panel-overlay" v-if="gameState === 'init' || gameState === 'gameover'">
          <div v-if="gameState === 'init'">
            <button class="button is-primary" @click="gameStart()">ゲームスタート</button>
          </div>
          <div class="has-text-centered" v-if="gameState === 'gameover'">
            <p class="is-size-3 has-text-danger">ゲームオーバー</p>
            <p class="mt-3 mb-3 has-text-info">{{ gameOverMessage }}</p>
            <div class="buttons">
              <button class="button is-primary" @click="gameStart()">もう一度プレイ</button>
              <button class="button" @click="copyResult()">スコアをコピー</button>
            </div>
          </div>
        </div>
      </div>
      <div class="content">
        <h3>操作説明</h3>
        <p>
          矢印キーあるいは画面をスワイプして、へびを操作します。
          <br />
          へびが数字を食べるとスコアが加算されます。
          <br />
          特定の順番で数字を食べるとコンボが発生し、ボーナススコアが加算されます。
          コンボの長さ分へびのしっぽが短くなります。
          <br />
          制限時間は120秒です。
        </p>
        <h3>更新履歴</h3>
        <ul>
          <li>2025/01/01 1時: リリース</li>
          <li>2025/01/01 7時: ヘビの初期位置を調整し、スコアがリセットされないバグを修正しました</li>
          <li>2025/01/01 8時: コンボのロジックを変更し、ゲームオーバー時のUIを調整しました</li>
        </ul>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import GameView from './components/GameView.vue'

const gameState = ref<'init' | 'playing' | 'gameover'>('init')
const gameOverMessage = ref<string>('')
const gameId = ref<string | null>(null)

const handleGameOver = (reason: string, score: number) => {
  gameState.value = 'gameover'
  gameOverMessage.value = `${reason} スコア: ${score}`
}

function gameStart() {
  gameState.value = 'playing'
  gameId.value = Date.now().toString()
}

function copyResult() {
  const text = `新年スネークゲームをプレイしました！${gameOverMessage.value}\n https://new-year-snake-game.vercel.app #2025スネークゲーム`;
  navigator.clipboard.writeText(text).then(() =>
    alert('スコアをコピーしました')
  );
}
</script>

<style scoped>
.game-panel {
  position: relative;
  margin-top: 20px;
  min-height: 400px;
}

.game-panel-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
