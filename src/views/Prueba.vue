
  <script setup>
  import { ref } from "vue";
  import EditableTable from './EditableTable.vue'
  
  const data = ref(
    {
      grupo:'pichurri',
      part:[
        { id: 1, nombre: "Elemento 1",cantidad:0,diferencia:0, descripcion: "Descripción 1" },
        { id: 2, nombre: "Elemento 2",cantidad:0,diferencia:0, descripcion: "Descripción 2" },
        { id: 3, nombre: "Elemento 3",cantidad:5,diferencia:0, descripcion: "Descripción 3" },
      ]
    }
  );

  </script>

  <template>
    <div>
      <h1>Tabla Editable</h1>
      <EditableTable :items="data" />
    </div>
  </template>