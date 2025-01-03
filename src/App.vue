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
              <button class="button" @click="showModal()">シェア</button>
            </div>
          </div>
        </div>
      </div>
      <ShareModal :text="modalText" v-model="modalActive" />
      <div class="content">
        <h3>操作説明</h3>
        <p>
          スペースキーあるいはボタンを押すとゲームがスタートします。<br />
          矢印キー（またはwasd, hjkl）あるいは画面をスワイプして、へびを操作します。
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
          <li>2025/01/01 9時: キーボードショートカットを追加</li>
          <li>2025/01/01 11時: スマートフォンでの表示を改善</li>
          <li>2025/01/03 9時: ソーシャルシェア機能追加</li>
        </ul>
        <h3>アクセス解析について</h3>
        <p>
          本サイトではサービス改善のためにGoogle Analyticsを使用してアクセス解析を行っています。
          <br />
          これらの内容は匿名で収集され、個人を特定するものではありません。
          <br />
          オプトアウトを希望される方は<a href="https://tools.google.com/dlpage/gaoptout?hl=ja">オプトアウトツール</a>をご利用ください。
        </p>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import GameView from './components/GameView.vue'
import { onKeyDown } from '@vueuse/core';
import ShareModal from './components/ShareModal.vue';

const gameState = ref<'init' | 'playing' | 'gameover'>('init')
const gameOverMessage = ref<string>('')
const gameId = ref<string | null>(null)
const modalActive = ref(false)
const modalText = ref('')

const handleGameOver = (reason: string, score: number) => {
  gameState.value = 'gameover'
  gameOverMessage.value = `${reason} スコア: ${score}`
}

const showModal = () => {
  console.log('show modal')
  modalText.value = `新年スネークゲームをプレイしました！${gameOverMessage.value}\nhttps://new-year-snake-game.vercel.app #2025スネークゲーム`;
  modalActive.value = true
}

function gameStart() {
  gameState.value = 'playing'
  gameId.value = Date.now().toString()
}

onKeyDown(' ', (event: KeyboardEvent) => {
  if (modalActive.value) {
    return
  }
  event.preventDefault()
  if (gameState.value !== 'playing') {
    gameStart()
  }
})

</script>

<style scoped>
.game-panel {
  position: relative;
  margin-top: 20px;
}

/* 横幅が400px以下の場合、セクションの左右のpaddingを消す */
@media screen and (max-width: 400px) {
  .section {
    padding-left: 0;
    padding-right: 0;
  }
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
