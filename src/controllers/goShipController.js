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
            conn.query('SELECT nombre FROM socios WHERE dni = ?', [data.dni], (err, row) => {
                if(row.length){
                    response.nombre = row[0].nombre;
                    res.json(response)
                }else{
                    response.nombre = ''
                    response.error = 'ERROR_DNI'
                    response.erdescrition = 'no se encuentra ningun usuario asociado a ese dni'
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

module.exports = controller