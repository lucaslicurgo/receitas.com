import express from 'express';
import { cadastroUsuario, editarUsuario, login } from './controladores/usuario';
import { autenticar } from './inter/autenticador';

const rotas = express();

rotas.post('/usuarios', cadastroUsuario);
rotas.post('/login', login);

rotas.use(autenticar);

rotas.put('/usuarios', editarUsuario);

export default rotas;