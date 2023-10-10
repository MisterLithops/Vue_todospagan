<script setup>
import Opcion from '../components/Opcion.vue';


</script>

<template>
  <main class="mt-52">
    <div class="flex justify-center gap-10">
      <Opcion
        foto="/img/un_grupo.jpg"
        texto="Nuevo Grupo"
        destino="nuevo"/>
      <Opcion
        foto="/img/buscar_grupos.png"
        texto="Buscar Grupo"
        destino="buscar"/>
    </div>
  </main>
</template>
