const express = require('express');
const products = require('./api/productos');
const router = express.Router();
const handlebars = require('express-handlebars');
const { use } = require('express/lib/application');

// App Express
const app = express();

// Settings
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.engine('.hbs', handlebars.engine({
    extname: '.hbs',
    defaultLayout: '',
    layoutsDir: __dirname + '',
}));
app.set('view engine', 'hbs');
app.set("views", "./views/layouts");

// Routes
app.get('/', (req, res) => {
    res.render('index');
});

app.get('/productos/vistas', (req, res) => {

    const items = products.viewAll()
    console.log(items)
    if (items.length > 0) {
        res.render('vista', { items: products.viewAll(), productsExists: true })
    } else {
        res.render('vista', { items: products.viewAll(), productsExists: false })
    }
});

app.use('/api', router);

router.get('/productos/listar', (req, res) => {

    const items = products.viewAll()
    if (items.length > 0) {
        res.json(items)
    } else {
        res.json({
            error: 'No hay productos cargados'
        })
    }
});

router.get('/productos/listar/:id', (req, res) => {

    const item = products.viewByID(req.params.id)

    if (item) {
        res.json(item)
    } else {
        res.json({
            error: 'El producto no fue encontrado'
        })
    }
});

router.post('/productos/guardar', (req, res) => {

    products.addProduct(req.body)

    res.redirect('/productos/vistas');
});

router.put('/productos/actualizar/:id', (req, res) => {
    const item = products.updateProduct(req.params.id, req.body)
    if (item) {
        res.json(item)
    } else {
        res.json({
            error: 'El producto no fue encontrado'
        })
    }
});

router.delete('/productos/borrar/:id', (req, res) => {
    const item = products.deleteProduct(req.params.id)

    if (item) {
        res.json(item)
    } else {
        res.json({
            error: 'El producto no fue encontrado'
        })
    }
});

// Server
const PORT = 8080;

const server = app.listen(PORT, () => {
    console.log(`server is running in http://localhost:${server.address().port}`);
});

server.on('error', error => {
    console.log('error in server:', error);
});