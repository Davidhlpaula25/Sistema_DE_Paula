const db = require('./src/config/database');

(async () => {
  try {
    console.log('🔄 Atualizando vendas para Karol...');
    
    // Atualizar venda #1
    const result1 = await db.query(
      'UPDATE vendas SET vendedor = $1 WHERE id = 1',
      ['Karol']
    );
    console.log('✅ Venda #1 atualizada para Karol');
    
    // Verificar venda #14
    const venda14 = await db.query('SELECT vendedor FROM vendas WHERE id = 14');
    if (venda14.rows[0] && (!venda14.rows[0].vendedor || venda14.rows[0].vendedor.trim() === '')) {
      await db.query('UPDATE vendas SET vendedor = $1 WHERE id = 14', ['Karol']);
      console.log('✅ Venda #14 também atualizada para Karol');
    }
    
    process.exit(0);
  } catch(e) {
    console.error('❌ Erro:', e.message);
    process.exit(1);
  }
})();
