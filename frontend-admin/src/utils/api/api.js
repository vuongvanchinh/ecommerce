import axios from 'axios';
const API_URL = 'http://127.0.0.1:8000/api/';

const instance =  axios.create({
    baseUrl: API_URL,
    // headers: {'X-Custom-Header': 'foobar'}
});

export default instance;