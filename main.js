const Koa = require('koa')
const Router = require('koa-router')
const serve = require('koa-static')
const fs = require('fs')
const path = require('path')


const app = new Koa()
const router = new Router

const imagedir = path.join(__dirname, 'images')

app.use(serve(imagedir))
app.use(router.routes())
app.use(router.allowedMethods)

router.get('/zumocat', (ctx) => {
    const imageFiles = fs.readdirSync(imagedir)
    const randomIndex = Math.floor(Math.random() * imageFiles.length)
    const randomZumoCatImage = imageFiles[randomIndex]

    ctx.type = path.extname(randomZumoCatImage)
    ctx.body = fs.createReadStream(path.join(imagedir, randomZumoCatImage))
})

app.listen(80, () => {
    console.log('[Server] - running on port 80')
})