<!-- Define a link style button (using button instead of a) component use setup script and typescript without naiveui -->
<script setup lang="ts">
const props = defineProps<{
    text: string;
}>();

// emit
const emit = defineEmits<{ click: [] }>();

const handleClick = () => {
    emit('click');
};

</script>

<template>
    <button @click="handleClick">{{ props.text }}</button>
</template>

<style scoped>
button {
    background-color: transparent;
    color: #4880FF;
    border: none;
    border-radius: 8px;
    padding: 4px 4px;
    cursor: pointer;
}

button:hover {
    color: #3063db;
}

button:active {
    color: #194396;
}
</style>