<script setup>
   import { onMounted, ref } from 'vue';
   import { RouterLink } from 'vue-router';
   import Nombrecito from '../components/Nombrecito.vue';
   import useGrupos from '../composables/useGrupos';
   import Spinete from "../components/Spinete.vue";
   import Swal from 'sweetalert2';

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

   const quitarElemento=(pos,nombre,id)=>{
      Swal
         .fire({
            title: `¿Eliminar al grupo ${nombre}?`,
            text:'Esta acción eliminará el grupo, sus integrantes y los movimientos asociados',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: "Sí, eliminar",
            cancelButtonText: "Cancelar",
         })
         .then(resultado => {
            if(resultado.isConfirmed){
               servicioGrupos.eliminaGrupo(id)
               grupos.value.splice(pos,1)
            }
         });
   }
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
               v-for="grupo,indice in grupos" 
               :key="grupo.id" 
               class="w-1/2 mx-auto mb-5 flex gap-3">
                  <RouterLink 
                     :to="{ name: 'cambalache', params: { id: grupo.id } }"
                     class="flex-1">
                        <Nombrecito :fondo='grupo.colorFondoG' :texto='grupo.colorTextoG' :nombre='grupo.nombre' />
                  </RouterLink>

                  <button 
                     type="button"
                     @click="quitarElemento(indice,grupo.nombre,grupo.id)">
                     <svg  class="w-8 h-8" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="red">
                     <path stroke-linecap="round" stroke-linejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                     </svg>
                  </button>
            </li>
         </ul>
      </div>

   </main>
</template>