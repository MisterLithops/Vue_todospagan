<script setup>
   import { onMounted, ref, version } from 'vue';
   import { RouterLink } from 'vue-router';
   import Nombrecito from '../components/Nombrecito.vue';
   import useGrupos from '../composables/useGrupos';
   import Spinete from "../components/Spinete.vue";

   const servicioGrupos = useGrupos()
   const grupos = ref([])
   const verSpin=ref(false)

   onMounted(() => {
      verSpin.value=true
      servicioGrupos.todosLosGrupos()
         .then((data) => {
            grupos.value = data
         })
      verSpin.value=false
   })
</script>

<template>
   <main class=" max-w-3xl mx-auto ">
      <h1 class="text-center text-4xl font-bold mt-5 mb-10">
         Elegir Grupo
      </h1>
      <div v-if="verSpin">
         <Spinete/>
      </div>
      <div v-else>
         <div v-if="grupos.length === 0">
            <p class="text-center font-bold text-xl ">
               Todavía no hay ningún grupo. Anda a dar uno de alta</p>
         </div>
         <ul v-else>
            <li 
               v-for="grupo in grupos" 
               :key="grupo.id" 
               class="w-1/2 mx-auto mb-5">
                  <RouterLink :to="{ name: 'cambalache', params: { id: grupo.id } }">
                     <Nombrecito :fondo='grupo.colorFondoG' :texto='grupo.colorTextoG' :nombre='grupo.nombre' />
                  </RouterLink>
            </li>
         </ul>
      </div>

   </main>
</template>