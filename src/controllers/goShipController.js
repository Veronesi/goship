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
        response.dni = 0
        response.error = 'REQUIRED_DNIORTOKEN'
        response.erdescrition = 'Se esperaba un dni y un token'
        res.json(response)
    }
}

module.exports = controller