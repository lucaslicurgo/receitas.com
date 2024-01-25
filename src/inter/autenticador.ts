import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { knex } from '../infra/conexao';

interface TokenDecodificado {
    id: Number
}

export const autenticar = async (req: Request, res: Response, next: NextFunction) => {

    const { authorization } = req.headers;

    if (!authorization) {
        return res.status(401).json({ mensagem: 'Não autorizado: faça o login para acessar!' })
    }

    const token = authorization.split(" ")[1]

    try {
        const tokenDecodificado = jwt.decode(token) as TokenDecodificado;

        if (!tokenDecodificado) {
            return res.status(401).json({ mensagem: 'Token inválido! Por favor, faça login novamente.' })
        }

        const usuarioExistente = await knex('usuarios').where({ id: tokenDecodificado.id }).first();

        if (!usuarioExistente) {
            return res.status(403).json({ mensagem: 'Cadastro não encontrado' })
        }

        const { senha: _, ...usuario } = usuarioExistente;
        console.log(usuario);

        (req as any).usuario = usuario;

        next();

    } catch (error) {
        return res.status(500).json({ erro: 'Erro interno do servidor.' })
    }
}