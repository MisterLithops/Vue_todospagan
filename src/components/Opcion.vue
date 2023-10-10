<script setup>
    import { RouterLink } from 'vue-router';
    defineProps(['foto','texto','destino'])
</script>

<template>
    <RouterLink
        :to="{name:destino}">
        <div class="bg-white max-w-sm rounded-lg overflow-hidden shadow-xl ">
        <img class=" w-60 h-60  object-cover " :src="foto" alt="Foto">
        <p class="text-center text-xl font-semibold py-2">{{texto}}</p>
        </div>  
    </RouterLink>
</template>