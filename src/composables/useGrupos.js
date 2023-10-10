import {supabase} from '../bd/supabase'

export default function useGrupos(){

    const todosLosGrupos=async()=>{
        const {data}=await supabase
           .from('grupos')
           .select()
        return data
    }

    const participantesPorGrupo=async(idBuscar)=>{
        const { data} = await supabase
            .from('grupos')
            .select('*,participantes(*,movimientos(*))')
            .eq('id',idBuscar)
            .single()
        return data
    }


    const movimientosPorParticipa=async(idBuscar)=>{
        const { data} = await supabase
            .from('movimientos')
            .select()
            .eq('id_participe',idBuscar)
        return data
    }

    const altaGrupo=async(datos)=>{
        const {data}=await supabase
            .from('grupos')
            .insert(datos)
            .select('*')
        return data;
    }

    const altaParticipantes=async(datos)=>{
        const {data}=await supabase
            .from('participantes')
            .insert(datos)
    }

    const altaMovimientos=async(datos)=>{
        const {data}=await supabase
            .from('movimientos')
            .insert(datos)
    }

    const actualizaMovimientos=async(datos)=>{
        const {data}=await supabase
            .from('movimientos')
            .upsert(datos)
    }

    const eliminaMovimientos=async(datos)=>{
        const {data}=await supabase
            .from('movimientos')
            .delete()
            .in('id',datos)
    }
    
    return{
        todosLosGrupos,
        altaGrupo,
        altaParticipantes,
        participantesPorGrupo,
        movimientosPorParticipa,
        altaMovimientos,
        actualizaMovimientos,
        eliminaMovimientos
    }
}