import api from './controllers/api';

const port = parseInt(process.env.PORT || '3001');
const server = api.listen(port, () => {
    console.log(`Goosechase server listening on port ${port}`);
});

export default server;