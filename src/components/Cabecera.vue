<script setup>

</script>

<template>
   <div class=" bg-slate-600 flex justify-between px-10 items-center py-4">
      <h1 
         class="text-slate-200 text-3xl font-extrabold"> TODOS 
         <span class="text-yellow-300">PAGAN</span>
      </h1>
      <RouterLink 
         class="flex gap-2"
         :to="{name:'prueba'}">
         <img
            width="60" 
            height="60"
            src="/img/mano1.png" 
            alt="dinero">
         <img
            width="60" 
            height="60"
            src="/img/mano2.png" 
            alt="dinero">
      </RouterLink>

      <RouterLink
         class="text-slate-200  text-xl "
         :to="{name:'inicio'}">
         Inicio
      </RouterLink>
   </div>
</template>