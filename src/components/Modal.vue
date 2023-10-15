<script setup>
    import { ref,computed } from "vue";
    import { formateoMoneda } from "../utilidades/funciones";
    import {avisoAvisador} from '../utilidades/avisos'
    import Swal from "sweetalert2";
    
    const props=defineProps(['mostrarModal','detalles','idParticipe','idsBorrar'])
    defineEmits(['cambiar-modal'])

    const nuevaCantidad=ref('')
    const nuevoConcepto=ref('')

    const total=computed(()=>props.detalles.reduce((tot,detal)=>tot+detal.cantidad,0)) 

    const borrarMovi=(ind,idBorrar)=>{
        Swal.fire({
            title: 'Vas a eliminar el gasto',
            text: "¿Estás completa y positivamente seguro de este acto?",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Adelante'
            }).then((result) => {
                if (result.isConfirmed) {
                    props.idsBorrar.push(idBorrar)
                    props.detalles.splice(ind,1)
                }
            })
    }

    const nuevoMovimiento=()=>{
        if(!nuevoConcepto.value){
            return avisoAvisador('Pon alguna cosa que sepamos en qué te gastas la pasta')
        }
        if(nuevaCantidad.value<=0 ){
            return avisoAvisador('Poco te has gastado')
        }
        
        props.detalles.push({
            cantidad:nuevaCantidad.value,
            concepto:nuevoConcepto.value,
            id_participe:props.idParticipe,
        })
        nuevaCantidad.value=''
        nuevoConcepto.value=''
    }

</script>

<template>
    <div v-if="mostrarModal"  class="fondo-modal">
        <div class=" bg-white p-7 max-w-2xl rounded-xl">
            <table
                v-if="detalles.length" 
                class="w-full text-left text-gray-900 border-collapse">
                <thead class="text-2xl bg-gray-300">
                    <tr>
                        <th >Concepto</th>
                        <th >Cantidad</th>
                        <th >Acciones</th>
                    </tr> 
                </thead>
                <tbody>
                    <tr v-for="movi,index in props.detalles" :key="index">
                        <td >
                            <input
                                class="outline-none text-lg"
                                type="text"
                                maxlength="20" 
                                v-model=" movi.concepto "
                                />
                            </td>
                        <td >
                            <input
                                class="outline-none text-lg"
                                type="number" 
                                min="0"
                                v-model=" movi.cantidad" 
                                />
                            </td>
                        <td class="text-center">
                            <button
                                type="button"
                                @click="borrarMovi(index,movi.id)">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="red" class="w-6 h-6">
                                    <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
                                  </svg>
                                  
                            </button>
                        </td>
                    </tr>
                </tbody>
                <tfoot>
                    <tr>
                        <td class="text-black font-bold text-lg">TOTAL:</td>
                        <td class="text-black font-bold text-lg">{{formateoMoneda(total) }}</td>
                    </tr>
                </tfoot>
            </table>

            <form 
                class="mt-5 border-gray-500 border-2 rounded-lg p-4 "
                :class="detalles.length ?'w-full' : 'w-96'">
                    <div class="w-2xl" >
                        <label 
                            for="conceto"
                            class="text-xl block font-semibold">
                                Concepto:
                        </label>
                        <input
                            v-model="nuevoConcepto"
                            maxlength="20" 
                            type="text" 
                            id="conceto"
                            class=" text-lg shadow-gray-300 shadow-lg w-1/2 hover:bg-blue-200 focus:bg-blue-200"
                            placeholder="En qué has gastao la pasta?">
                    </div>
                    <div >
                       <label 
                            for="pasta"
                            class="text-xl block font-semibold mt-3">
                                Cantidad:
                        </label>
                        <input
                            v-model="nuevaCantidad"
                            maxlength="20" 
                            type="number" 
                            id="pasta"
                            min="0"
                            class=" text-lg shadow-gray-300 shadow-lg w-1/2 hover:bg-blue-200 focus:bg-blue-200"
                            placeholder="Y cuánto t'as gastao?"> 
                    </div>
                    <div>
                        <button
                            class="py-2 px-6 text-white bg-green-600 hover:bg-green-700 mt-3 rounded-lg font-semibold text-lg shadow-md " 
                            type="button"
                            @click="nuevoMovimiento">
                                Añadir
                        </button>
                    </div>
                    
            </form>
            <div class="text-center">
                <button
                    class="py-2 px-6 text-white bg-blue-600 hover:bg-blue-700 mt-3 rounded-lg font-semibold text-lg shadow-md"
                    @click="$emit('cambiar-modal')" 
                    type="button">
                        Cerrar
                </button>
            </div>
            
        </div>
    </div>
</template>

<style scoped>
    .fondo-modal{
        position: fixed;
        inset: 0;
        background-color: rgba(0,0,0,.6);
        display: grid;
        place-items: center;
    }
    td,th{
        padding: .5rem;
        border-width: 1px;
        border-color: black;
    }

</style>