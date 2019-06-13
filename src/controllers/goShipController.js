var crypto = require('crypto')
shasum = crypto.createHash('sha1');

const controller = {}

controller.list = (req, res) => {
    req.getConnection((err, conn) => {
        conn.query('SELECT * FROM socios', (err, row) =>{
            if(err){
                res.json(err);
            }
            res.render('index.ejs', {
                data: row
            })
        })
    })

}

controller.save = (req, res) => {
    const data = req.body

    req.getConnection((err, conn) => {
        conn.query('INSERT INTO socios set ?', [data], (err, row) => {
            console.log(row)
            res.send('works')
        })
    })
}
controller.login = (req, res) => {
    let data = req.body
    let response = {}
    if(data.dni){
        response.dni = data.dni
        req.getConnection((err, conn) => {
            conn.query('SELECT s.nombre, u.token FROM socios s , usuarios u WHERE u.dni = ? AND u.dni = s.dni AND password = ?', [data.dni, data.password], (err, row) => {
                shasum.update(data.dni+data.password);
                response.token = shasum.digest('hex');
                if(row.length){
                    response.nombre = row[0].nombre;
                    res.json(response)
                    if(row[0].token == null || row[0].token != response.token){
                        req.getConnection((err, conn) => {
                            conn.query('UPDATE usuarios SET token = ? WHERE dni = ?', [response.token, data.dni], (err, row) => {})
                        })
                    }
                }else{
                    response.nombre = ''
                    response.error = 'ERROR_LOGIN'
                    response.erdescrition = 'Dni o contraseña incorrecta'
                    res.json(response)
                }
            })
        })
    }else{
        response.dni = 0
        response.error = 'REQUIRED_DNI'
        response.erdescrition = 'Se esperaba un dni'
        res.json(response)
    }
}

controller.getDespacho = (req, res) => {
    var data = req.body
    var response = {}
    if(typeof data.detalle == "undefined"){ data.detalle = " "}
    if(typeof data.personas == "undefined"){ data.personas = " "}
    if(typeof data.observacion == "undefined"){ data.observacion = " "}
    if(data.dni && data.token && data.fechasalida && data.horasalida && data.fechallegada && data.horallegada && data.idembarca && data.destino && data.detalle && data.personas && data.observacion){
        if(data.dni && data.token){
            req.getConnection((err, conn) => {
                conn.query('SELECT u.id FROM usuarios u WHERE u.dni = ? AND u.token = ?', [data.dni, data.token], (err, row) => {
                    if(row.length){
                        req.getConnection((err, conn) => {
                            conn.query('SELECT e.id FROM usuarios u, embarca e WHERE u.dni = ? AND u.id = e.idusuario AND e.id = ?', [data.dni, data.idembarca], (err, row) => {
                                if(row.length){
                                    // Fijarme si ya hay un despacho en ese periodo de timpo
                                    // SELECT * FROM despacho WHERE (fechasalida BETWEEN '2018-08-06' AND '2018-08-06' AND horasalida BETWEEN '17:00:00' AND '18:00:00') OR (fechallegada BETWEEN '2018-08-06' AND '2018-08-06' AND horallegada BETWEEN '17:00:00' AND '18:00:00') OR (fechasalida <= '2018-08-06' AND '2018-08-06' <= fechallegada AND horasalida <= '17:00:00' AND '18:00:00' <= horallegada);
                                    req.getConnection((err, conn) => {
                                        conn.query('INSERT INTO despacho (idusuario, fechasalida, horasalida, detalle, fechallegada, horallegada, personas, idembarca, observacion, destino) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)', [row[0].id, data.fechasalida, data.horasalida, data.detalle, data.fechallegada, data.horallegada, data.personas ,data.idembarca, data.observacion ,data.destino], (err, row) => {
                                            response.despacho = data
                                            res.json(response)   
                                         })
                                    })
                                }else{
                                    response.error = 'ERROR_EMBARCA'
                                    response.erdescrition = 'Esa embarca no pertenece a ese usuario'
                                    res.json(response)
                                }
                            })
                        })
                    }else{
                        response.error = 'ERROR_LOGIN'
                        response.erdescrition = 'Dni o contraseña incorrecta'
                        res.json(response)
                    }
                })
            })
        }else{
            response.error = 'REQUIRED_DNIORTOKEN'
            response.erdescrition = 'Se esperaba un dni y un token'
            res.json(response)
        }
    }else{
        response.error = 'ERROR_data'
        response.erdescrition = 'faltan campos'
        res.json(response)
    }
    
}

controller.getEmbarca = (req, res) => {
    let data = req.body
    let response = {}
    if(data.dni && data.token){
        req.getConnection((err, conn) => {
            conn.query('SELECT u.id FROM usuarios u WHERE u.dni = ? AND u.token = ?', [data.dni, data.token], (err, row) => {
                if(row.length){
                    req.getConnection((err, conn) => {
                        conn.query('SELECT e.id, e.nombre, e.tipo, e.matricula FROM usuarios u, embarca e WHERE u.dni = ? AND u.id = e.idusuario', [data.dni], (err, row) => {
                            if(row.length){
                                response.embarca = {}
                                row.forEach(function(elem, index){
                                    response.embarca[index] = {
                                        id: elem.id,
                                        nombre: elem.nombre,
                                        tipo: elem.tipo,
                                        matricula: elem.matricula
                                    }
                                });
                                res.json(response)
                            }else{
                                response.erdescrition = 'No posee ninguna embarca'
                                response.error = 'ERROR_EMBARCA'
                                response.embarca = {}
                                res.json(response)
                            }
                        })
                    })
                }else{
                    response.error = 'ERROR_LOGIN'
                    response.erdescrition = 'Dni o contraseña incorrecta'
                    res.json(response)
                }
            })
        })
    }else{
        response.error = 'REQUIRED_DNIORTOKEN'
        response.erdescrition = 'Se esperaba un dni y un token'
        res.json(response)
    }
}

module.exports = controller