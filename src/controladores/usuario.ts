import bcrypt from 'bcrypt';
import { Request, Response } from "express";
import { knex } from '../infra/conexao';

export const cadastroUsuario = async (req: Request, res: Response) => {
    const { nome, email, senha } = req.body;

    try {
        const emailExistente = await knex('usuarios').where({ email }).first();

        if (emailExistente) {
            return res.status(400).json({ mensagem: 'Esse e-mail já está cadastrado. Tente outro e-mail ou faça o login' });
        }

        const senhaCrypt = await bcrypt.hash(senha, 10);

        const cadastro = await knex('usuarios').insert({ nome, email, senha: senhaCrypt }).returning(["id", "nome", "email"]);

        return res.status(201).json(cadastro[0]);
    } catch (error) {
        console.log(error);
        return res.status(500).json({ mensagem: 'Erro interno do servidor.' });
    }
}