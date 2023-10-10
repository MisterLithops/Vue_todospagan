export const formateoMoneda=(cantidad)=>{
    const cantFormateada=cantidad.toLocaleString('es-ES',{
        style:'currency',
        currency:'EUR'
    })
    return cantFormateada
}