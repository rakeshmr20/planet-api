const fastify = require('fastify')({
    logger: true,
});

const path = require('path');
const packageJSON = require('./package.json');
const appConfig = require('./config/appConfig.json');
const fs = require('fs');

fastify.get('/info', (req, res) => {
    res.send({
        name: packageJSON.name,
        version: packageJSON.version,
        description: packageJSON.description,
    });
});

fastify.register(require('./routes/router'), { prefix: '' });

global.rootDir = __dirname;
const fileInit = () => {
    const filePath = path.resolve(__dirname, './datasets/fav.txt');
    try {
        if (!fs.existsSync(filePath)) {
            fs.writeFileSync(filePath, '[]');
        } else {
            let stats = fs.statSync(filePath);
            let size = stats["size"];
            if (size == 0) {
                fs.writeFileSync(filePath, '[]');
            }
        }
    } catch(err) {
        console.warn(err);
    }
}


fastify.setNotFoundHandler((request, reply) => {
    reply.code(403).type('application/json').send({
        statusCode: 403,
        status: 403,
        message: 'Forbidden',
    });
});

(async () => {
    fastify.listen(appConfig.port, appConfig.host, (err, address) => {
        if (err) {
            fastify.log.error(err);
            process.exit(1);
        }
        fileInit();
        fastify.log.info(`Environment is:' ${process.env.NODE_ENV}`);
        fastify.log.info(`server listening on ${address}`);
    });
})();
