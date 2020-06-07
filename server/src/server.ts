import express from 'express';
import cors from 'cors';
import path from 'path';
import routes from './routes';
import { errors } from 'celebrate';

require('dotenv/config');

// Getting your LAN address
import dns from 'dns';
import os from 'os';

async function main() {
    try {
        dns.lookup(os.hostname(), function (err, add, fam) {
            process.env.IP_ADDRESS = add;
            console.log(`Server Running on ${process.env.IP_ADDRESS}:${process.env.PORT}`);
            const app = express();

            app.use(cors());
            app.use(express.json());
            app.use(routes);

            app.use('/uploads', express.static(path.resolve(__dirname, '..', 'uploads')));

            app.use(errors());

            app.listen(process.env.PORT);
        });
    } catch (error) {
        console.error('Error:', error);
    }
}
main();
