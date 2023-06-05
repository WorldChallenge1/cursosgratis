const express = require("express")
const bodyParser = require("body-parser")
const request = require("request")
const url = require("url")
const http = require("http")
const https = require("https")

const app = express()
const port = process.env.PORT || 3500

app.use(express.static("public"))
app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json())

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/signup.html")
})


app.post("/subscribe", (req, res) => {
  let email = req.body.email
  email = email.toLowerCase()

  const hostname = "cursosgratisapi.onrender.com"

  const options = {
    hostname: hostname,
    path: "/subscribe?email=" + email,
    method: "GET"
  }
  const request = https.request(options, (response) => {
    console.log(`statusCode: ${response.statusCode}`)
    if (response.statusCode === 201) {
      console.log("success")
      res.send("Se ha suscrito correctamente!")
    } else if (response.statusCode === 409) {
      console.log("duplicate")
      res.send("El email ya está registrado.")
    } else if (response.statusCode === 400) {
      console.log("invalid")
      res.send("Email inválido.")
    }
    response.on("data", (d) => {
      console.log(d.toString())
    })
  })

  request.on("error", (error) => {
    console.error(error)
  })

  request.end()


  console.log(email)

})

app.post("/unsubscribe", (req, res) => {
  let email = req.body.email
  email = email.toLowerCase()

  const hostname = "cursosgratisapi.onrender.com"

  const options = {
    hostname: hostname,
    path: "/unsubscribe?email=" + email,
    method: "GET"
  }

  const request = https.request(options, (response) => {
    console.log(`statusCode: ${response.statusCode}`)

    if (response.statusCode === 200) {
      console.log("success")
      res.send("Se ha desuscrito correctamente!")
    } else if (response.statusCode === 404) {
      console.log("not found")
      res.send("El email no está registrado.")
    } else if (response.statusCode === 400) {
      console.log("invalid")
      res.send("Email inválido.")
    }

    res.on("data", (d) => {
      console.log(d.toString())
    })
  })

  request.on("error", (error) => {
    console.error(error)
  })

  request.end()


  console.log(email)
})


app.listen(port, () => {
  console.log(`listening on port ${port}`)
})
