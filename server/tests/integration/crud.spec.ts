import knex from '../../src/database/connection';

describe('CRUD Tests Case', () => {
    beforeAll(async () => {
        await knex.migrate.rollback();
        await knex.migrate.latest();
        await knex.seed.run();
    });

    afterAll(async () => {
        await knex.destroy();
        await knex.migrate.down();
    });

    it('Should return success on creating a new point', async () => {
        const data = {
            name: 'Mercado do Jaiminho',
            email: 'contato@jaimemarketplace.com.br',
            whatsapp: 2112345678,
            latitude: -55355421,
            longitude: '-1324556',
            city: 'Tangamandapio',
            uf: 'SP',
            items: [1, 2, 6],
        };

        const { name, email, whatsapp, latitude, longitude, city, uf, items } = data;

        const trx = await knex.transaction();

        const point = {
            image:
                'https://images.unsplash.com/photo-1556767576-5ec41e3239ea?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=400&q=60',
            name,
            email,
            whatsapp,
            latitude,
            longitude,
            city,
            uf,
        };

        const insertedIds = await trx('points').insert(point);

        const [point_id] = insertedIds;

        const pointItems = items.map((item_id: number) => ({
            item_id,
            point_id,
        }));

        const response = await trx('point_items').insert(pointItems);

        await trx.commit();

        expect(response).toContain(3);
    });

    it('Should return an index of points', async () => {
        const [response] = await knex('points').select('*');

        expect(response).toHaveProperty('email');
    });

    it('Should return all listed items', async () => {
        const response = await knex('items').select('*');
        expect(response).toHaveLength(6);
    });

    it('Should return all item by point', async () => {
        const [{ id }] = await knex('points').select('id');

        const [items] = await knex('items')
            .join('point_items', 'items.id', '=', 'point_items.item_id')
            .where('point_items.point_id', id)
            .select('items.title');

        expect(items).toHaveProperty('title', 'Lâmpadas');
    });
});
