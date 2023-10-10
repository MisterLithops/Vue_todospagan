 
  <script setup>
    import { ref,computed } from "vue";
    import {formateoMoneda} from '../utilidades/funciones'
    import Swal from "sweetalert2";
    import { colores } from "../utilidades/constantes";
    import  Spinete  from "../components/Spinete.vue";

    const props=defineProps (['items'])

    const textoModal = ref('Primero');
    const colorFElegido=ref('')
    const colorTElegido=ref('')

    const total=computed(()=>{
      const participa=props.items.part
      const suma= participa.reduce((tot,sumando)=>tot+sumando.cantidad,0)
      const cadaUno=(suma/participa.length)
      participa.forEach(e => {
        const dif=cadaUno-e.cantidad
        if (dif>0){
          e.diferencia=`Paga: ${formateoMoneda(dif)}`
        }else{
          e.diferencia=`Cobra: ${formateoMoneda(Math.abs(dif))}`
        }
      });
      return {suma,cadaUno}
      
    })

    const verModal=(valor)=>{
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
          textoModal.value=resultado.value
        }
      })

    }

    const elijeColor=(ind)=>{
      colorFElegido.value=colores[ind].fondo
      colorTElegido.value=colores[ind].texto
    }

  </script>

  <template>
    <table>
      <thead>
        <tr>
          <th>ID</th>
          <th>Nombre</th>
          <th>Descripción</th>
          <th>Cantidad</th>
          <th>Diferencia</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(item, index) in items.part" :key="index">
          <td>{{ item.id }}</td>
          <td>
            <input v-model="item.nombre" />
          </td>
          <td>
            <input v-model.number="item.descripcion"  />
          </td>
          <td>
            <input v-model.number="item.cantidad"  />
          </td>
          <td>
            <input  v-model.number="item.diferencia" />
          </td>
        </tr>
      </tbody>
    </table>
    <div class=" ml-52 mt-10">
      <p>Total: {{ formateoMoneda(total.suma) }}</p>
      <p>Por persona: {{ formateoMoneda(total.cadaUno) }}</p>
    </div>

<div class="text-center">
      <button 
      class="bg-green-600 p-3 text-white"
      type="button"
      @click="verModal(textoModal)">
        MODAL
    </button>
    
</div>
<div class="text-center mt-5">
  {{ textoModal }}
  
</div>

<div class=" w-28 mx-auto  mt-5 grid grid-cols-3 gap-0 ">
  <button 
  @click="elijeColor(indice)"
    v-for="color,indice in colores" 
    :class="color.fondo"
    class="w-8 h-8 mb-1">
  </button>
  <div 
    :class="colorFElegido,colorTElegido"
    class=" w-28 mx-auto p-3 text-center">
    Muestra
  </div>
</div>

<div>
  <Spinete/>
</div>


  </template>
  