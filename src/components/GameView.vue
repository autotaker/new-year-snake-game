<template>
    <div style="text-align:center;">
        <canvas ref="gameCanvas" width="400" height="400"></canvas>
        <div class="mt-3">
            スコア: {{ gameInfo.score }} | 体長: {{ gameInfo.snakeLength }} | 経過: {{ gameInfo.elapsedSec }}s | Stack: [{{
                gameInfo.ateStack.join(', ') }}]
        </div>
    </div>
</template>

<script setup lang="ts">
import { onUnmounted, ref, reactive, watchEffect } from 'vue'
import { useSnakeGame, type GameInfo } from '@/composables/useSnakeGame'
import { defineEmits } from 'vue'

const gameCanvas = ref<HTMLCanvasElement | null>(null)
const gameInfo = reactive<GameInfo>({
    score: 0,
    snakeLength: 0,
    elapsedSec: '0.0',
    ateStack: []
})
const emit = defineEmits(['gameOver'])
// Composableに refs を渡すだけ

let unmountHandler: (() => void) | null = null

function gameOverHandler(reason: string, score: number) {
    emit('gameOver', reason, score)
}

watchEffect(() => {
    console.log('gameCanvas.value:', gameCanvas.value)
    if (gameCanvas.value) {
        const { onMountedHandler, onUnmountedHandler } = useSnakeGame(gameCanvas.value, gameInfo, gameOverHandler)
        onMountedHandler()
        unmountHandler = onUnmountedHandler
    }
})
onUnmounted(() => {
    if (unmountHandler) {
        unmountHandler()
    }
});
</script>

<style scoped>
canvas {
    background: #fff;
    border: 2px solid #ccc;
    display: block;
    margin: 0 auto;
}
</style>
