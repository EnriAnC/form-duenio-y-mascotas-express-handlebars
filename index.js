const express = require('express');
const app = express()
const handlebars  = require('express-handlebars');
const fs = require('fs')

app.use(express.static(__dirname + '/public'))

app.engine('hbs', handlebars.engine({ extname: '.hbs', }));

app.set('view engine', 'hbs');
app.set('views', __dirname+'/views');

app.get('/', (req,res)=>{
    res.render('home')
})

app.get('/lista-mascotas', (req,res)=>{
    res.render('lista-mascotas')
})
    

app.route('/duenios-mascotas')
    .get((req,res)=>{
        fs.readFile('duenio-mascotas.json', {encoding: 'utf-8'}, (err, data)=>{
            try {
                data = JSON.parse(data)
                console.log(data)
                res.json(data)
            } catch (err) {
                console.log('Error:', err)
                res.status(401).send('Error en GET')
            }
        })
        
    })
    .post(express.json(), (req,res)=>{
        let body = req.body
        fs.readFile('duenio-mascotas.json', {encoding: 'utf-8'}, (err, data)=>{
            try {
                data = JSON.parse(data)
                data.push({rut:body.rut, mascota:body.mascota})
                fs.writeFileSync('duenio-mascotas.json', JSON.stringify(data))
                res.end('Agregado con exito')
            } catch (err) {
                console.log('Error:', err)
                res.status(401).send('Error en POST')
            }
        })
    })

app.all('/duenios-mascotas/rut/:rut', (req,res)=>{
    let params = req.params
    if (req.method == 'GET'){
        fs.readFile('duenio-mascotas.json', {encoding: 'utf-8'}, (err, data)=>{
            try {
                data = JSON.parse(data)
                res.json(data.filter(el=>el.rut==params.rut))
            } catch (err) {
                console.log('Error:', err)
                res.status(404).send('Error en DELETE')
            }
        })
    }
    if (req.method == 'DELETE'){
        fs.readFile('duenio-mascotas.json', {encoding: 'utf-8'}, (err, data)=>{
            try {
                data = JSON.parse(data)

                index = data.findIndex(el => el.rut == params.rut)
                if (index < 0){
                    res.status(401).send('Not found')
                } else {
                    newData = data.filter(el => el.rut !== params.rut)
                    console.log(data)
                    fs.writeFileSync('duenio-mascotas.json', JSON.stringify(newData))
                    res.json(data.filter(el => el.rut === params.rut))
                }
            } catch (err) {
                console.log('Error:', err)
                res.status(401).send('Error en DELETE')
            }
        })
    }
})

app.all('/duenios-mascotas/mascota/:mascota', (req,res)=>{
    let params = req.params
    if (req.method == 'GET'){
        fs.readFile('duenio-mascotas.json', {encoding: 'utf-8'}, (err, data)=>{
            try {
                data = JSON.parse(data)
                res.json(data.find(el=>el.mascota==params.mascota))
            } catch (err) {
                console.log('Error:', err)
                res.status(401).send('Error en DELETE')
            }
        })
    }
    if (req.method == 'DELETE'){
        fs.readFile('duenio-mascotas.json', {encoding: 'utf-8'}, (err, data)=>{
            try {
                data = JSON.parse(data)
                index = data.findIndex(el => el.mascota == params.mascota)
                if (index < 0){
                    res.status(401).send('Not found')
                } else {
                    dataDeleted = data.splice(index, 1)
                    fs.writeFileSync('duenio-mascotas.json', JSON.stringify(data))
                    res.json(dataDeleted)
                }
            } catch (err) {
                console.log('Error:', err)
                res.status(401).send('Error en DELETE')
            }
        })
    }
})

app.listen(3000)
