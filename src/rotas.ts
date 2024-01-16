import express from 'express';
import { cadastroUsuario } from './controladores/usuario';

const rotas = express();

rotas.post('/usuarios', cadastroUsuario);

export default rotas;