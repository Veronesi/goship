# goship

## POST api/login

Devueve el token para realizar las transacciones

**Request body (raw)**
```
{
    "dni": "11111111",
    "password": "123456789",
}
```

**Response body (raw)**
```
{
    "token": "ed11d0d4117957001ebbf21d5923efc12f640c75",
    "nombre": "example"
}
```

## PUT api/despacho

Crea un nuevo despacho

**Request body (raw)**
```
{
	"dni" : "11111111",
	"token" : "ed11d0d4117957001ebbf21d5923efc12f640c75",
	"fechasalida" : "2018-08-06",
	"horasalida" : "17:00:00",
	"fechallegada" : "2018-08-06",
	"horallegada" : "21:00:00",
	"idembarca" : "1",
	"destino" : "Isla",
	"observacion" :" ",
	"detalle" : " ",
	"personas" : "solo yo"
}
```

**Response body (raw)**
```
{
    "despacho": "ok"
}
```
