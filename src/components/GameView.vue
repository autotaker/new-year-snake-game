<template>
    <div class="has-text-centered">
        <canvas ref="gameCanvas"></canvas>
        <div class="mt-3">
            スコア: {{ gameInfo.score }} | 体長: {{ gameInfo.snakeLength }} | 残り時間: {{ gameInfo.remaningSeconds.toFixed(1)
            }}s
        </div>
        <div class="mt-3 toast is-size-3 has-text-weight-bold has-text-warning" v-if="comboMessage">
            {{ comboMessage }}
        </div>
    </div>
</template>

<script setup lang="ts">
import { onUnmounted, ref, reactive, watchEffect, watch, onMounted } from 'vue'
import { useSnakeGame, type GameInfo } from '@/composables/useSnakeGame'
import { defineEmits } from 'vue'
import { usePointerSwipe } from '@vueuse/core'

const props = defineProps<{
    gameId: string | null
}>()
const gameCanvas = ref<HTMLCanvasElement | null>(null)
const gameInfo = reactive<GameInfo>({
    state: 'init',
    score: 0,
    snakeLength: 0,
    remaningSeconds: 120,
    ateStack: []
})
const comboMessage = ref<string>('')
const emit = defineEmits(['gameOver'])
// Composableに refs を渡すだけ

usePointerSwipe(gameCanvas, {
    onSwipeEnd: (_, direction) => {
        if (game) {
            switch (direction) {
                case 'up':
                case 'down':
                case 'left':
                case 'right':
                    game.changeDirection(direction)
                    break
                case 'none':
                    break
            }
        }
    }
})


function gameOverHandler(reason: string, score: number) {
    emit('gameOver', reason, score)
}

let toastTimer: number | null = null
function comboHandler(combo: string, message: string, bonus: number) {
    if (toastTimer) {
        clearTimeout(toastTimer)
    }
    comboMessage.value = `${message} ${combo}! +${bonus}`
    toastTimer = setTimeout(() => {
        comboMessage.value = ''
    }, 2000)
}

let game: ReturnType<typeof useSnakeGame> | null = null

function onKeyDown(e: KeyboardEvent) {
    if (!game) {
        console.log('game is not ready')
        return
    }
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

watch(() => props.gameId, (newVal) => {
    console.log('gameId:', newVal)
    if (game) {
        game.gameStart()
    }

})

watchEffect(() => {
    if (gameCanvas.value && !game) {
        game = useSnakeGame(gameCanvas.value, gameInfo, gameOverHandler, comboHandler)
        if (props.gameId !== null) {
            game.gameStart()
        }
    }
})
onMounted(() => {
    document.addEventListener('keydown', onKeyDown)
})
onUnmounted(() => {
    if (game) {
        game.onUnmountedHandler()
    }
    document.removeEventListener('keydown', onKeyDown)
});
</script>

<style scoped>
canvas {
    background: #fff;
    border: 2px solid #ccc;
    display: block;
    margin: 0 auto;
    touch-action: none;
    aspect-ratio: 1/1;
    width: 100%;
    min-width: 350px;
    max-width: 600px;
}
</style>
