<script setup lang="ts">
import { ref, watch } from 'vue';

const props = defineProps<{
    text: string;
}>();

const isModalActive = defineModel<boolean>()

function closeModal() {
    isModalActive.value = false;
}

const textAreaContent = ref(props.text);

watch(() => props.text, (newValue) => {
    textAreaContent.value = newValue;
});

const shareOnTwitter = () => {
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(textAreaContent.value)}`;
    window.open(url, '_blank');
};

const copyToClipboard = () => {
    navigator.clipboard.writeText(textAreaContent.value).then(() => {
        alert('クリップボードにコピーしました');
    });
};
</script>

<template>
    <div class="modal" :class="{ 'is-active': isModalActive }">
        <div class="modal-background" @click="closeModal()"></div>
        <div class="modal-card">
            <header class="modal-card-head">
                <p class="modal-card-title">シェアする</p>
                <button class="delete" aria-label="close" @click="closeModal()"></button>
            </header>
            <section class="modal-card-body">
                <textarea v-model="textAreaContent" class="textarea" rows="5"></textarea>
            </section>
            <footer class="modal-card-foot">
                <div class="buttons">
                    <button class="button is-info" @click="shareOnTwitter">X(Twitter)</button>
                    <button class="button" @click="copyToClipboard">コピー</button>
                </div>
            </footer>
        </div>
    </div>
</template>
