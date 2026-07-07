function mergeData(prospects, contracts) {
    const prospectsMap = {}
    const contractsMap = {}

    prospects.forEach(p => {
        const id = normalizeValue(p.ID)
        prospectsMap[id] = p
    })

    contracts.forEach(c => {
        const id = normalizeValue(c.ID)
        contractsMap[id] = c
    })

    const allIds = new Set([
        ...prospects.map(p => normalizeValue(p.ID)),
        ...contracts.map(c => normalizeValue(c.ID))
    ])

    return Array.from(allIds).map(id => {
        const prospect = prospectsMap[id] || {}
        const contract = contractsMap[id] || {}
        const hasContract = !!(contract.ID || contract['Plano de venda'])

        return {
            'ID': id || '',
            'Razão': prospect['Razão'] || contract['Razão'] || '',
            'Telefone celular': prospect['Telefone celular'] || contract['Telefone celular'] || '',
            'Canal de venda': prospect['Canal de venda'] || contract['Canal de venda'] || '',
            'Campanha de venda': prospect['Campanha de venda'] || contract['Campanha de venda'] || '',
            'Vendedor': prospect['Vendedor'] || contract['Vendedor'] || '',
            'Status': hasContract ? 'Vencemos' : (prospect['Status'] || ''),
            'Motivo perdemos': prospect['Motivo perdemos'] || '',
            'Data do cadastro': prospect['Data do cadastro'] || prospect['Data Cadastro'] || '',
            'Plano de venda': contract['Plano de venda'] || '',
            'Valor do plano': contract['Valor do plano'] || '',
            'Taxa de ativação': contract['Taxa de ativação'] || '',
            'Data ativação': contract['Data ativação'] || contract['Data Ativação'] || ''
        }
    })
}