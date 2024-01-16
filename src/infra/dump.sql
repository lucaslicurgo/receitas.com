CREATE DATABASE receitas;

CREATE TABLE usuarios(
    id SERIAL PRIMARY KEY,
    nome VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    senha VARCHAR(255) NOT NULL,
);

CREATE TABLE categorias(
    id SERIAL PRIMARY KEY,
    nome_categoria VARCHAR(55) UNIQUE NOT NULL
);

CREATE TABLE receitas(
    id SERIAL PRIMARY KEY,
    titulo VARCHAR(100) NOT NULL,
    descricao TEXT,
    instrucoes TEXT NOT NULL,
    usuario_id INTEGER NOT NULL REFERENCES usuarios(id),
    categoria_id INTEGER NOT NULL REFERENCES categorias(id)
);