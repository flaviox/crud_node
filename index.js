const restify = require('restify');
const errs = require('restify-errors');

const server = restify.createServer({
    name: 'myapp',
    version: '1.0.0'
});

const knex = require('knex')({
    client: 'mysql',
    connection: {
        host: '127.0.0.1',
        user: 'root',
        password: '',
        database: 'crud_node'
    }
});

server.use(restify.plugins.acceptParser(server.acceptable));
server.use(restify.plugins.queryParser());
server.use(restify.plugins.bodyParser());

server.listen(8080, function() {
    console.log('%s listening at %s', server.name, server.url);
});

server.get('/', function(req, res, next) {
    knex('newsletters').then((dados) => { res.send(dados); }, next);
    return next();
});

server.get('/:id', function(req, res, next) {
    const { id } = req.params;
    knex('newsletters')
        .where('id', id)
        .first()
        .then((dados) => {
            if (!dados)
                return res.send(new errs.BadRequestError('Nada foi encontrado!'));
            res.send(dados);
        }, next);

    return next();
});

server.put('/update/:id', function(req, res, next) {
    const { id } = req.params;
    knex('newsletters')
        .where('id', id)
        .update(req.body)
        .then((dados) => {
            if (!dados)
                return res.send(new errs.BadRequestError('Nada foi encontrado!'));
            res.send('Dados atualizados!');
        }, next);
    return next();
});

server.del('/delete/:id', function(req, res, next) {
    const { id } = req.params;
    knex('newsletters')
        .where('id', id)
        .delete()
        .then((dados) => {
            if (!dados)
                return res.send(new errs.BadRequestError('Nada foi encontrado!'));
            res.send('Dados excluido!');
        }, next);
    return next();
});

server.post('/create', function(req, res, next) {
    knex('newsletters')
        .insert(req.body)
        .then((dados) => { res.send(dados); }, next);
    return next();
});