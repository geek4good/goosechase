import api from './api';

const port = parseInt(process.env.PORT || '3000');
const server = api.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});

export default server;