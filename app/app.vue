<template>
  <div>
    <NuxtRouteAnnouncer />
    <NuxtWelcome />
  </div>
</template>

<script setup>
onMounted(() => {

  fetch('/api/or')
    .then((res) => res.json())
    .then((data) => {
      console.log(data)
    })
})
</script>