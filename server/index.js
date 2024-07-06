import app from './app.js';
import { connect } from './src/config/database.js';
const PORT = process.env.PORT || 9000;
const HOST = process.env.HOST || 'http://localhost';

app.listen(PORT, () => {
    console.log(`Server Listening at ${HOST}:${PORT}`);
    connect(err => {
        if (err) {
            console.log(err);
        }
    });
});