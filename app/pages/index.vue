<template>
    <div v-for="brand in oil_data">
        <h1>{{ brand.brand }}</h1>
        <p>{{ brand.data }}</p>
    </div>
</template>

<script setup>
const oil_data = ref()

onMounted(async () => {
    oil_data.value = await fetch_price();
})
</script>