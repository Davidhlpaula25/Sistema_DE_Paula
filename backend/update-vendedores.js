const db = require('./src/config/database');

(async () => {
  try {
    console.log('🔄 Atualizando vendedores nas vendas antigas...');
    
    const result = await db.query(`
      UPDATE vendas v 
      SET vendedor = c.usuario 
      FROM caixas c 
      WHERE v.caixa_id = c.id 
      AND (v.vendedor IS NULL OR v.vendedor = '' OR v.vendedor = 'Não informado')
    `);
    
    console.log('✅ Vendas atualizadas:', result.rowCount);
    process.exit(0);
  } catch(e) {
    console.error('❌ Erro:', e.message);
    process.exit(1);
  }
})();
