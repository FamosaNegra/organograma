const express = require('express');
const { Pool } = require('pg');
const path = require('path');
const cors = require('cors');  // Adicione esta linha

const app = express();
const port = 3080;

// Configurações do banco de dados
const pool = new Pool({
    user: 'postgres',
    host: 'db.mxdyiwlpvxbfoyxbvoxd.supabase.co',
    database: 'postgres',
    password: '@Ph974985101',
    port: 5432,
});

app.use(cors());  // Adicione esta linha para permitir CORS

// Servir arquivos estáticos a partir do diretório 'public'
app.use(express.static(path.join(__dirname, 'public')));

// Rota para obter dados do organograma
app.post('/api/obterDadosOrganograma', async (req, res) => {
    try {
        const client = await pool.connect();
        const result = await client.query('SELECT * FROM "Organograma"');
        const organogramaData = formatarDadosOrganograma(result.rows);
        client.release();

        res.json(organogramaData);
    } catch (error) {
        console.error('Erro ao obter dados do organograma:', error);
        res.status(500).json({
            error: 'Erro ao obter dados do organograma'
        });
    }
});

function formatarDadosOrganograma(rows) {
    const nodes = [];

    rows.forEach(row => {
        const node = {
            id: row.id,
            name: row.nome,
            pid: row.idsup,
            cargo: row.funcao,
            departamento: row.departamento,
            // Adicione mais campos conforme necessário
        };

        nodes.push(node);
    });

    return nodes;
}

// Rota para servir o arquivo index.html na raiz ("/")
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Inicia o servidor
app.listen(port, () => {
    console.log(`Servidor rodando na porta ${port}`);
});
