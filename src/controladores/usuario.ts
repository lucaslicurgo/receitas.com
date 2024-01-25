import bcrypt from 'bcrypt';
import { Request, Response } from "express";
import jwt, { Secret } from 'jsonwebtoken';
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

export const login = async (req: Request, res: Response) => {
    const { email, senha } = req.body;

    try {
        const usuario = await knex('usuarios').where({ email }).first();

        if (!usuario) {
            return res.status(400).json({ mensagem: 'Email ou senha inválidos' })
        }

        if (!await bcrypt.compare(senha, usuario.senha)) {
            return res.status(400).json({ mensagem: 'Email ou senha inválidos' })
        }

        const token = await jwt.sign({ id: usuario.id }, process.env.PASS_HASH as Secret, { expiresIn: '8h' });

        return res.status(200).json({ token: token });

    } catch (error) {
        return res.status(500).json({ mensagem: 'Erro interno do servidor.' });
    }
}

export const editarUsuario = async (req: Request, res: Response) => {
    const { nome, email, senha } = req.body;

    try {
        if (email !== (req as any).usuario.email) {
            const emailExistente = await knex('usuarios').where({ email }).first();

            if (emailExistente) {
                return res.status(400).json({ mensagem: 'Esse e-mail já está cadastrado. Tente outro e-mail ou faça o login' })
            }
        }

        const senhaCrypt = await bcrypt.hash(senha, 10);

        await knex('usuarios').where('id', (req as any).usuario.id).update({ nome, email, senha: senhaCrypt });

        return res.status(201).json();
    } catch (error) {
        return res.status(500).json({ mensagem: 'Erro interno do servidor.' })
    }
}