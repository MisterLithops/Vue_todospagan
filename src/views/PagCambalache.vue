<script setup>
   import {ref,computed } from 'vue';
   import {useRoute} from 'vue-router'
   import Nombrecito from '../components/Nombrecito.vue'
   import {formateoMoneda} from '../utilidades/funciones'
   import Spinete from "@/components/Spinete.vue";
   import useGrupos from '../composables/useGrupos'
   import Modal from '../components/Modal.vue';

   const almacenGrupos=useGrupos()

   const rutas=useRoute()
   const idGrupo=rutas.params.id
   const grupo=ref([]);
   const detalles=ref([]);
   const idsBorrar=ref([]);
   const idParticipe=ref('');
   const verSpin=ref(false)
   const verModal=ref(false)

   const obtenerDatos=async(idBuscar)=>{
      verSpin.value=true
      const resp=await almacenGrupos.participantesPorGrupo(idBuscar)
      grupo.value=resp
      verSpin.value=false
   }

   const total = computed(() => {
      const participantes = grupo.value.participantes;
      const suma = participantes.reduce((total, participante) => {
         const puesto = participante.movimientos.reduce((tot, movimiento) => tot + movimiento.cantidad, 0);
         participante.puesto = puesto;
         return total + puesto;
      }, 0);

      const cadaUno = suma / participantes.length;

      participantes.forEach(participante => {
         participante.diferencia = cadaUno - participante.puesto;
      });

      return { suma, cadaUno };
   });

   const cambiarModal=()=>{
      
      verModal.value=!verModal.value
   }

   const mostrarDetalle=(indexParticipe)=>{
      detalles.value= grupo.value.participantes[indexParticipe].movimientos
      idParticipe.value=grupo.value.participantes[indexParticipe].id
      verModal.value=!verModal.value
   }

   const guardarCambios=async()=>{
      const altaMovs=[]
      const actualizaMovs=[]
      grupo.value.participantes.forEach((participe)=>{
         participe.movimientos.forEach(movi=>{
            if(movi.id){
               actualizaMovs.push(movi)
            }else{
               altaMovs.push(movi)
            }
         })
      })

      if(altaMovs.length){
         try {
            await almacenGrupos.altaMovimientos(altaMovs)
         } catch (error) {
            console.log(error);
         }
      }
      if(actualizaMovs.length){
         try {
            await almacenGrupos.actualizaMovimientos(actualizaMovs)
         } catch (error) {
            console.log(error);
         }
      }
      if(idsBorrar.value.length){
         try {
            await almacenGrupos.eliminaMovimientos(idsBorrar.value)   
         } catch (error) {
            console.log(error);
         }
      }
   }

   const verTransacciones=()=>{

   }

   obtenerDatos(idGrupo)
</script>

<template>
   <main class=" max-w-5xl mx-auto">
      <div 
         v-if="verSpin"
         class="mt-60">
         <Spinete/>
      </div>
      <div v-else>
         <div class="flex justify-between items-center px-10 mt-5 mb-7">
            <h1 class="text-center text-4xl font-bold ">
               Vamos a Hacer Cuentas
            </h1>
            <RouterLink 
               class="font-bold"
               :to="{name:'buscar'}">
               <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="3" stroke="red" class="w-8 h-8">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M9 15L3 9m0 0l6-6M3 9h12a6 6 0 010 12h-3" />
               </svg>
               
            </RouterLink>
         </div>

         <Nombrecito
            class="text-2xl"
            :fondo=grupo.colorFondoG
            :texto=grupo.colorTextoG
            :nombre=grupo.nombre />

         <ul class="mt-10 text-center">
            <li class="text-xl font-bold mt-1 grid grid-cols-5 gap-3 mb-5">
               <p>Participante: </p>
               <p class="col-span-2">Contribuciones: </p>
               <p>Saldo: </p>
               <p>Acciones: </p>
            </li>
            <li
               class=" grid items-center p-2 grid-cols-5 gap-4 border-b-2 border-gray-500 " 
               v-for="participe,indice in grupo.participantes">
               <Nombrecito
                  :fondo=participe.colorFondoP
                  :texto=participe.colorTextoP
                  :nombre=participe.nombre />
                  <ul class=" col-span-2">
                     <li v-for="movi in participe.movimientos">
                        <div class=" flex justify-between pl-5 text-lg font-semibold relative">
                           <p class="text-left max-w-[60%] ml-1">- {{movi.concepto}}</p>
                           <p class=" absolute bottom-0 right-0">{{formateoMoneda(movi.cantidad)}}</p>
                        </div>
                     </li>
                     <li  class="flex justify-end gap-5 text-lg font-black ">
                        <p class="pl-4">TOTAL:</p>
                        <p> {{formateoMoneda(Math.abs(participe.puesto))}}</p>
                       
                     </li>
                  </ul>
                     <p
                        :class=" participe.diferencia>0 ?'text-red-500 ':'text-green-500 '"
                        class="text-center font-bold text-lg " >
                        {{participe.diferencia===0?'': participe.diferencia>0 ?'Pagar ':'Cobrar ' }}
                        {{formateoMoneda(Math.abs(participe.diferencia))}}
                     </p> 
               <div class="mx-auto">
                  <button
                     @click="mostrarDetalle(indice)">
                     <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-8 h-8">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M8.25 6.75h12M8.25 12h12m-12 5.25h12M3.75 6.75h.007v.008H3.75V6.75zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zM3.75 12h.007v.008H3.75V12zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm-.375 5.25h.007v.008H3.75v-.008zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
                     </svg>
                  </button>
               </div>

            </li>
         </ul>
         <div class="flex gap-7 mt-10">
            <p class="text-xl font-bold">TOTAL: <span class="bg-blue-300 border border-indigo-800 px-2 text-indigo-800 font-extrabold"> {{ formateoMoneda(total.suma) }}</span></p>
            <p class="text-xl font-bold">Por persona: <span class=" bg-blue-300 border border-indigo-800 px-2 text-indigo-800 font-extrabold">{{ formateoMoneda(total.cadaUno) }}</span></p>
         </div>

      </div>
      <div class="mt-10 text-center">
         <button
            @click="guardarCambios"
            class="py-2 px-6 text-white bg-green-600 hover:bg-green-700 mt-3 rounded-lg font-semibold text-lg shadow-md "  
            type="button">
            Guardar Cambios
         </button>
      </div>
      <div class="mt-10 text-center">
         <button
            @click="verTransacciones"
            class="py-2 px-8 text-white bg-yellow-600 hover:bg-yellow-700 mt-3 rounded-lg font-semibold text-lg shadow-md "  
            type="button">
            Pagos y Cobros
         </button>
      </div>
   </main> 
   <Modal
      :idsBorrar="idsBorrar"
      :idParticipe="idParticipe"
      :mostrarModal="verModal"
      :detalles="detalles"
      @cambiar-modal="cambiarModal" />
</template>





