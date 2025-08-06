import axios from 'axios';
export const api = axios.create({ baseURL: 'https://api.example.com' });
export const fetchUsers = () => api.get('/users');
