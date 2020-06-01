
const handlers = require('../handlers/planet')
const schema = require('../config/appConfig.json')

async function routes(fastify, options) {
    fastify.get(
        schema.planet.fetchAll.schema.url,
        handlers.fetchAll,
    );

    fastify.post(
        schema.planet.addFavourite.schema.url,
        handlers.addFavourite,
    );

    fastify.post(
        schema.planet.fetchFavourite.schema.url,
        handlers.fetchFavourite,
    );
}

module.exports = routes