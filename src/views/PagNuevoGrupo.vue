<script setup>
   import Swal from "sweetalert2";
   import { ref,reactive } from 'vue';
   import { colores } from '../utilidades/constantes'
   import {avisoAvisador} from '../utilidades/avisos'
   import Nombrecito from '../components/Nombrecito.vue';
   import useGrupos from '../composables/useGrupos'
   import { useRouter } from 'vue-router';

   const servicioGrupos=useGrupos()
   const rutas=useRouter()

   const participantes = ref([])
   const nombre = ref('')
   const nombreGrupo = ref('')
   const nuevoGrupo=reactive({})
   const verTodo=ref(false)

   const otroParticipante = () => {
      if(nombre.value){
         const indice=Math.floor(Math.random()*12)
         const elemento={
            nombre:nombre.value,
            colorFondoP:colores[indice].fondo,
            colorTextoP:colores[indice].texto,
         }
         participantes.value.push(elemento)
         nombre.value=''
      }else{
         avisoAvisador('Hay que poner algún nombre')
      }
   }

   const quitarElemento=(pos,nombre)=>{
      Swal
         .fire({
            title: `¿Eliminar al pobre ${nombre}?`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: "Sí, eliminar",
            cancelButtonText: "Cancelar",
         })
         .then(resultado => {
            if(resultado.isConfirmed){
                  participantes.value.splice(pos,1)
            }
         });
   }

   const altaGrupo=()=>{
      if (nombreGrupo.value){
         const indice=Math.floor(Math.random()*12)
         verTodo.value=true
         nuevoGrupo.nombre=nombreGrupo.value
         nuevoGrupo.colorTextoG=colores[indice].texto
         nuevoGrupo.colorFondoG=colores[indice].fondo
      }else{
         avisoAvisador('Pon un nombrecito p\'al grupo, anda')
      }
   }

   const subirGrupo=async()=>{
      if(!participantes.value.length){
         avisoAvisador('Pero si no hay gente ')
      }else{
         const resp= await servicioGrupos.altaGrupo(nuevoGrupo)
         participantes.value.forEach(element => {
            element.grupo_id=resp[0].id
         });
         await servicioGrupos.altaParticipantes(participantes.value)
         rutas.push({name:'inicio'})
      }
   }

   const cambiarParticipante=(pos)=>{
      Swal.fire({
        title: 'Cambio de nombre',
        input:'text',
        inputValidator:valor=>{
            if (!valor) {
               return (`Pon algo para cambiar`)
            }else if(valor.length>25){
               return ('25 caracteres máximo')
            }else{
               return undefined
            }
        },
        showCancelButton: true,
        cancelButtonText:'Cancelar',
        confirmButtonText: 'Cambiar',
        focusConfirm: false,
      }).then((resultado) => {
        if(resultado.isConfirmed){
          participantes.value[pos].nombre=resultado.value
        }
      })
    }
   const cambiarGrupo=()=>{
      Swal.fire({
        title: 'Cambio de nombre',
        input:'text',
        inputValidator:valor=>{
            if (!valor) {
             return (`Pon algo para cambiar`)
            }else{
              return undefined
            }
        },        
        showCancelButton: true,
        cancelButtonText:'Cancelar',
        confirmButtonText: 'Cambiar',
        focusConfirm: false,
      }).then((resultado) => {
        if(resultado.isConfirmed){
          nuevoGrupo.nombre=resultado.value
        }
      })
    }

</script>

<template>
   <main class=" max-w-3xl mx-auto ">
      <h1 class="text-center text-4xl font-bold mt-5 mb-10">Crear Nuevo Grupo</h1>
      <div 
         v-if="!verTodo"
         class="mb-5 flex justify-between">
         <div >
            <label 
               class=" text-xl font-semibold mr-3 " 
               for="nomGrupo">
                  Nombre del Grupo: 
            </label>
            <input 
               class="border border-gray-400 py-1.5 pl-1 text-gray-900 rounded"
               type="text" 
               id="nomGrupo"
               v-model="nombreGrupo"> 
         </div>
         <button 
            class=" w-1/4 bg-green-600 hover:bg-green-700 text-white px-3 py-1 text-lg  font-semibold rounded-lg "
            type="button"
            @click="altaGrupo">
               Crear Grupo
         </button>
      </div>
      <div 
         v-else
         class="mb-10 ">
         <button 
            class="w-full"
            @dblclick="cambiarGrupo">
               <Nombrecito
                  :fondo='nuevoGrupo.colorFondoG'
                  :texto='nuevoGrupo.colorTextoG'
                  :nombre='nuevoGrupo.nombre'/>   
         </button>
         
      </div>
      <div 
         v-if="verTodo"
         class="flex justify-between border-gray-400 border-2 p-4 rounded-xl">
         <div>
            <label 
               class="block text-xl font-semibold" 
               for="nombre">
                  Nombre:
            </label>
            <input 
               class="block border border-gray-400 py-1.5 pl-1 text-gray-900 rounded my-4" type="text"
               id="nombre" 
               maxlength="25"
               v-model="nombre">
            <button
               class="hover:cursor-pointer bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-1 text-lg w-full font-semibold rounded-lg "
               type="button" @click="otroParticipante">
               Añadir
            </button>
         </div>
         <div class="text-center">
            <h2 class="text-xl font-semibold">Participantes</h2>
               <ul >
                     <li 
                     v-for="participe,indice in participantes "
                     :key="indice"
                     class=" flex items-center justify-between gap-2 mt-2">
                        <Nombrecito
                           :fondo='participe.colorFondoP'
                           :texto='participe.colorTextoP'
                           :nombre='participe.nombre'
                        />
                        <button 
                           type="button"
                           @click="cambiarParticipante(indice)">
                           <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="green" class="w-8 h-8">
                              <path stroke-linecap="round" stroke-linejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                            </svg>
                        </button>         
                        <button 
                           type="button"
                           @click="quitarElemento(indice,participe.nombre)">
                           <svg  class="w-8 h-8" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="red">
                           <path stroke-linecap="round" stroke-linejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                         </svg>
                        </button>
                     </li>
               </ul>
         </div>
         
      </div>
      <button 
         v-if="verTodo"
         type="button"
         @click="subirGrupo"
         class="block mx-auto mt-10 w-1/3 bg-green-600 hover:bg-green-700 text-white px-3 py-1 text-lg  font-semibold rounded-lg ">
            Dar de alta
      </button>
   </main>
  
</template>