<script setup>
    defineProps([
        'fondo',
        'texto',
        'nombre'
    ])

</script>

<template>
    <p
    :class="fondo,texto"
    class="text-center w-full rounded-lg border-2 border-black p-2 font-bold ">
       {{ nombre }}
    </p>
</template>