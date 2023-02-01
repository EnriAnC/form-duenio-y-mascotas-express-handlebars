const d = document;

d.addEventListener('DOMContentLoaded', e=>{
    d.addEventListener('click', e=>{
        if (e.target.matches('#btn-get-duenio-mascota')) {
            getAll('table-duenio-mascotas');
        }

    })
    d.addEventListener('submit', e=>{
        e.preventDefault()
        // Obtener mascotas por rut de dueño o por nombre de mascota
        if (e.target.matches('#GET-ONE')) {
            console.log(e.target.id.value)
            getOne('table-un-duenio-mascotas', e);
        }

         // Eliminar mascota(s) por rut de dueño o por nombre de mascota
        if (e.target.matches('#DELETE')) {
            deleteOne('table-eliminados', e)
        }
        
        if (e.target.matches('#post-one')){
            postOne(e);
            getAll('table-duenio-mascotas');
        }
        
    })
})


getAll = async (tableId)=> {
    let res = await axios.get("http://localhost:3000/duenios-mascotas"),
    data = res.data
    console.log(data)
    const $table = d.getElementById(tableId)
    $table.children[1].innerHTML = ''
    data.forEach(el=>{
        const tr = d.createElement('tr')
        Object.values(el).forEach(el=>{
            const td = d.createElement('td')  
            td.innerHTML = el
            tr.append(td)
        })
        $table.children[1].append(tr)
    })
}

getOne = async (tableId, e)=> {
    let res = null
    let data = null
    if (e.target.select.value == 'rut'){
        rut = e.target.id.value
        res = await axios.get("http://localhost:3000/duenios-mascotas/rut/"+rut)
        data = res.data
    }
    if (e.target.select.value == 'mascota'){
        mascota = e.target.id.value
        res = await axios.get("http://localhost:3000/duenios-mascotas/mascota/"+mascota)
        data = res.data
        data = [data]
    }
    console.log(data)
    const $table = d.getElementById(tableId)
    $table.children[1].innerHTML = ''
    const tr = d.createElement('tr')
    data.forEach(el=>{
        const tr = d.createElement('tr')
        Object.values(el).forEach(el=>{
            const td = d.createElement('td')  
            td.innerHTML = el
            tr.append(td)
        })
        $table.children[1].append(tr)
    })
    $table.append(tr)
    

}

deleteOne = async (tableId, e)=> {
    let res = null
    let data = null
    if (e.target.select.value == 'rut'){
        rut = e.target.id.value
        res = await axios.delete("http://localhost:3000/duenios-mascotas/rut/"+rut)
        data = res.data
    }
    if (e.target.select.value == 'mascota'){
        mascota = e.target.id.value
        res = await axios.delete("http://localhost:3000/duenios-mascotas/mascota/"+mascota)
        data = res.data
    }
    console.log(data)
    const $table = d.getElementById(tableId)
    $table.children[1].innerHTML = ''
    const tr = d.createElement('tr')
    data.forEach(el=>{
        const tr = d.createElement('tr')
        Object.values(el).forEach(el=>{
            const td = d.createElement('td')  
            td.innerHTML = el
            tr.append(td)
        })
        const td = d.createElement('td')  
        td.innerHTML = 'Eliminado'
        tr.append(td) 
        $table.children[1].append(tr)
        
    })
    $table.append(tr)
    

}

postOne = async (e)=>{
    axios.post("http://localhost:3000/duenios-mascotas",{
        rut: e.target.rut.value,
        mascota: e.target.mascota.value,
    })
}