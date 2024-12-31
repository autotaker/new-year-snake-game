<template>
    <div style="text-align:center;">
        <canvas ref="gameCanvas" width="600" height="600"></canvas>
        <div class="mt-3">
            スコア: {{ gameInfo.score }} | 体長: {{ gameInfo.snakeLength }} | 経過: {{ gameInfo.elapsedSec }}s | Stack: [{{
                gameInfo.ateStack.join(', ') }}]
        </div>
    </div>
</template>

<script setup lang="ts">
import { onUnmounted, ref, reactive, watchEffect } from 'vue'
import { useSnakeGame, type GameInfo, type Direction } from '@/composables/useSnakeGame'
import { defineEmits } from 'vue'
import { usePointerSwipe } from '@vueuse/core'

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
let changeDirection: ((direction: Direction) => void) | null = null

usePointerSwipe(gameCanvas, {
    onSwipeEnd: (e, direction) => {
        if (changeDirection) {
            switch (direction) {
                case 'up':
                case 'down':
                case 'left':
                case 'right':
                    changeDirection(direction)
                    break
                case 'none':
                    break
            }
        }
        console.log('onSwipe:', e)
        console.log('direction:', direction)
    }
})


function gameOverHandler(reason: string, score: number) {
    emit('gameOver', reason, score)
}

watchEffect(() => {
    console.log('gameCanvas.value:', gameCanvas.value)
    if (gameCanvas.value) {
        const game = useSnakeGame(gameCanvas.value, gameInfo, gameOverHandler)
        changeDirection = game.changeDirection
        game.onMountedHandler()
        function onKeyDown(e: KeyboardEvent) {
            switch (e.key) {
                case 'ArrowUp':
                    game.changeDirection('up')
                    e.preventDefault()
                    break
                case 'ArrowDown':
                    game.changeDirection('down')
                    e.preventDefault()
                    break
                case 'ArrowLeft':
                    game.changeDirection('left')
                    e.preventDefault()
                    break
                case 'ArrowRight':
                    game.changeDirection('right')
                    e.preventDefault()
                    break
            }
        }
        unmountHandler = () => {
            document.removeEventListener('keydown', onKeyDown)
            game.onUnmountedHandler()
        }
        document.addEventListener('keydown', onKeyDown)
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
    touch-action: none;
}
</style>
