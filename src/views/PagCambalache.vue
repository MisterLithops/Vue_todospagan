<script setup>
   import {ref,computed } from 'vue';
   import {useRoute, useRouter} from 'vue-router'
   import Nombrecito from '../components/Nombrecito.vue'
   import {formateoMoneda} from '../utilidades/funciones'
   import { colores } from '../utilidades/constantes'
   import Spinete from "@/components/Spinete.vue";
   import useGrupos from '../composables/useGrupos'
   import Modal from '../components/Modal.vue';
   import { avisoAvisador } from '../utilidades/avisos';
   import Swal from 'sweetalert2';

   const almacenGrupos=useGrupos()  

   const ruteador=useRouter()
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
      if(resp){
         grupo.value=resp
         verSpin.value=false
      }else{
         ruteador.push({name:'inicio'})
      }
       
   }

   obtenerDatos(idGrupo)

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
      let mensaje=''
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
            mensaje='Altas bien '
         } catch (error) {
            mensaje='Error en altas '
            console.log(error);
         }
      }
      if(actualizaMovs.length){
         try {
            await almacenGrupos.actualizaMovimientos(actualizaMovs)
            mensaje+='Modificaciones bien '
         } catch (error) {
            mensaje+='Error en modificaciones '
            console.log(error);
         }
      }
      if(idsBorrar.value.length){
         try {
            await almacenGrupos.eliminaMovimientos(idsBorrar.value)
            mensaje+='Eliminaciones bien'
         } catch (error) {
            mensaje+='Error en eliminaciones'
            console.log(error);
         }
      }
      avisoAvisador(mensaje)
   }

   const borrarParticipe=async(id,indice)=>{
      Swal.fire({
         title: `¿Eliminar al participante?`,
         text:'Se borrará junto con todas sus aportaciones. Esta acción es irreversible',
         icon: 'warning',
         showCancelButton: true,
         confirmButtonText: "Sí, eliminar",
         cancelButtonText: "Cancelar",
      }).then(async res=>{
         if(res.isConfirmed){
            try {
               await almacenGrupos.eliminaParticipe(id)
               grupo.value.participantes.splice(indice,1)
               avisoAvisador('Borrado')
            } catch (error) {
               avisoAvisador('Algo malo pasó')
               console.log(error);
            }
         }
      })
   }

   const transacciones=computed(()=>{
      const trans=[]
      const cobran=[]
      const pagan=[]

      const {participantes}=grupo.value
      if(participantes===undefined){
         return []
      }
      participantes.forEach((p)=>{
         if(p.diferencia<0){
            cobran.push({
               'nombre':p.nombre,
               'cantidad':Math.abs(p.diferencia)
            })
         }else if(p.diferencia>0){
            pagan.push({
               'nombre':p.nombre,
               'cantidad':Math.abs(p.diferencia)
            })
         }
      })

      cobran.sort((a,b)=>b.cantidad -a.cantidad)
      pagan.sort((a,b)=>b.cantidad -a.cantidad)
      let sigue=true
      if(cobran.length===0 || pagan.length===0){
               sigue=false
            }
         while (sigue) {
            const pagador = pagan[0];
            const cobrador=cobran[0]

        
            if(pagador.cantidad>cobrador.cantidad){
               trans.push({
                  "pagador":pagador.nombre,
                  "cobrador":cobrador.nombre,
                  "cantidad":cobrador.cantidad
               }) 
               cobran.splice(0,1)
               pagan[0].cantidad-=cobrador.cantidad
            }else if(pagador.cantidad===cobrador.cantidad){
               trans.push({
                  "pagador":pagador.nombre,
                  "cobrador":cobrador.nombre,
                  "cantidad":cobrador.cantidad
               }) 
               cobran.splice(0,1)
               pagan.splice(0,1)
            }else{
               trans.push({
                  "pagador":pagador.nombre,
                  "cobrador":cobrador.nombre,
                  "cantidad":pagador.cantidad
               })
               pagan.splice(0,1)
               cobran[0].cantidad-=pagador.cantidad
            }
            if(cobran.length===0 || pagan.length===0){
               sigue=false
            }
         }
         return trans
      }
   )

   const añadirParticipe=()=>{
      Swal.fire({
        title: 'Añadir otro paganini',
        input:'text',
        inputValidator:valor=>{
            if (!valor) {
               return (`¿Que no tiene nombre o qué?`)
            }else if(valor.length>25){
               return ('25 caracteres máximo, porfi')
            }else{
               return undefined
            }
        },
        showCancelButton: true,
        cancelButtonText:'Cancelar',
        confirmButtonText: 'Añadir',
        focusConfirm: false,
      }).then(async(resultado) => {
        if(resultado.isConfirmed){
         try {
               const indice=Math.floor(Math.random()*12)
               const elemento={
                  nombre:resultado.value,
                  colorFondoP:colores[indice].fondo,
                  colorTextoP:colores[indice].texto,
                  grupo_id:grupo.value.id,
               } 
               const resp=await almacenGrupos.altaParticipantes(elemento)
               elemento.movimientos=[] 
               elemento.id=resp[0].id
               grupo.value.participantes.push(elemento) 
            } catch (error) {
               avisoAvisador('Algo malo pasó')
               console.log(error);
            }
           
         }
      })
   }
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
               <div class="mx-auto flex gap-3">
                  <button
                     @click="mostrarDetalle(indice)">
                     <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="green" class="w-8 h-8">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M10.343 3.94c.09-.542.56-.94 1.11-.94h1.093c.55 0 1.02.398 1.11.94l.149.894c.07.424.384.764.78.93.398.164.855.142 1.205-.108l.737-.527a1.125 1.125 0 011.45.12l.773.774c.39.389.44 1.002.12 1.45l-.527.737c-.25.35-.272.806-.107 1.204.165.397.505.71.93.78l.893.15c.543.09.94.56.94 1.109v1.094c0 .55-.397 1.02-.94 1.11l-.893.149c-.425.07-.765.383-.93.78-.165.398-.143.854.107 1.204l.527.738c.32.447.269 1.06-.12 1.45l-.774.773a1.125 1.125 0 01-1.449.12l-.738-.527c-.35-.25-.806-.272-1.203-.107-.397.165-.71.505-.781.929l-.149.894c-.09.542-.56.94-1.11.94h-1.094c-.55 0-1.019-.398-1.11-.94l-.148-.894c-.071-.424-.384-.764-.781-.93-.398-.164-.854-.142-1.204.108l-.738.527c-.447.32-1.06.269-1.45-.12l-.773-.774a1.125 1.125 0 01-.12-1.45l.527-.737c.25-.35.273-.806.108-1.204-.165-.397-.505-.71-.93-.78l-.894-.15c-.542-.09-.94-.56-.94-1.109v-1.094c0-.55.398-1.02.94-1.11l.894-.149c.424-.07.765-.383.93-.78.165-.398.143-.854-.107-1.204l-.527-.738a1.125 1.125 0 01.12-1.45l.773-.773a1.125 1.125 0 011.45-.12l.737.527c.35.25.807.272 1.204.107.397-.165.71-.505.78-.929l.15-.894z" />
                        <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                  </button>
                  <button
                     @click="borrarParticipe(participe.id,indice)">
                     <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="red" class="w-8 h-8">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                      </svg>                      
                  </button>
               </div>

            </li>
         </ul>
         <div class="flex gap-7 mt-10">
            <p class="text-xl font-bold">TOTAL: <span class="bg-blue-300 border border-indigo-800 px-2 text-indigo-800 font-extrabold"> {{ formateoMoneda(total.suma) }}</span></p>
            <p class="text-xl font-bold">Por persona: <span class=" bg-blue-300 border border-indigo-800 px-2 text-indigo-800 font-extrabold">{{ formateoMoneda(total.cadaUno) }}</span></p>
         </div>
      </div >
      <div v-if="transacciones.length>0" class="mt-10 text-center">
         <table
            class="w-full text-left text-gray-900 border-collapse">
            <thead class="text-2xl bg-blue-300">
               <tr>
                   <th >Deudor</th>
                   <th >Cantidad</th>
                   <th >Acreedor</th>
               </tr> 
            </thead>
            <tbody class="text-lg font-semibold">
               <tr v-for="trans,index in transacciones" :key="index">
                  <td>
                     {{ trans.pagador }} 
                  </td>
                  <td>
                     {{formateoMoneda(trans.cantidad) }} 
                  </td>
                  <td>
                     {{ trans.cobrador }}
                  </td>
               </tr>
            </tbody>
         </table>
      </div>

      <div class="mt-10 text-center flex justify-evenly">
         <button
            @click="añadirParticipe"
            class="py-2 px-6 text-white bg-green-600 hover:bg-green-700 mt-3 rounded-lg font-semibold text-lg shadow-md "  
            type="button">
            Añadir Participante
         </button>
         <button
            @click="guardarCambios"
            class="py-2 px-6 text-white bg-green-600 hover:bg-green-700 mt-3 rounded-lg font-semibold text-lg shadow-md "  
            type="button">
            Guardar Cambios
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

<style scoped>
   td,th{
      padding: .5rem;
      border-width: 1px;
      border-color: black;
   }

</style>



