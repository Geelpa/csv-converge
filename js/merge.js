function mergeData(prospects, contracts) {
    const prospectsMap = new Map();
    const contractsMap = new Map();

    // 1. Mapeia os dados salvando as linhas originais
    prospects.forEach(p => {
        if (p.ID) prospectsMap.set(normalizeValue(p.ID), p);
    });

    contracts.forEach(c => {
        if (c.ID) contractsMap.set(normalizeValue(c.ID), c);
    });

    const allIds = new Set([...prospectsMap.keys(), ...contractsMap.keys()]);

    // 2. Monta o objeto final SEM a propriedade "Vendedor"
    return Array.from(allIds).map(id => {
        const p = prospectsMap.get(id) || {};
        const c = contractsMap.get(id) || {};

        const hasContract = !!(c.ID || c['Plano de venda']);

        return {
            'ID': id,
            'Razão': c['Razão'] || p['Razão'] || '',
            'Telefone celular': c['Telefone celular'] || p['Telefone celular'] || '',
            'Canal de venda': c['Canal de venda'] || p['Canal de venda'] || '',
            'Campanha de venda': c['Campanha de venda'] || p['Campanha de venda'] || '',

            // Aqui entram EXCLUSIVAMENTE as duas opções que você precisa:
            'Vendedor Prospect': p['Vendedor Prospect'] || p['Vendedor'] || '',
            'Vendedor Contrato': c['Vendedor Contrato'] || c['Vendedor'] || '',

            'Status': hasContract ? 'Vencemos' : (p['Status'] || ''),
            'Contrato Gerado': hasContract ? 'Sim' : 'Não',
            'Motivo perdemos': p['Motivo perdemos'] || '',
            'Data do cadastro': p['Data do cadastro'] || '',
            'Plano de venda': c['Plano de venda'] || '',
            'Valor do plano': c['Valor do plano'] || '',
            'Taxa de ativação': c['Taxa de ativação'] || '',
            'Data ativação': c['Data ativação'] || ''
        };
    });
}