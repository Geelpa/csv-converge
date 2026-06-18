function mergeData(prospects, contracts) {

    const prospectsMap = {}
    const contractsMap = {}

    prospects.forEach(p => {
        prospectsMap[normalizeValue(p.ID)] = p
    })

    contracts.forEach(c => {
        contractsMap[normalizeValue(c.ID)] = c
    })

    const allIds = new Set([
        ...Object.keys(prospectsMap),
        ...Object.keys(contractsMap)
    ])

    return Array.from(allIds).map(id => {

        const prospect = prospectsMap[id] || {}
        const contract = contractsMap[id] || {}

        const hasContract = !!contract.ID

        return {

            ID:
                contract.ID ||
                prospect.ID ||
                '',

            RAZÃO:
                contract.Razão ||
                prospect.Razão ||
                '',

            'TELEFONE CELULAR':
                prospect['Telefone celular'] ||
                '',

            'CANAL DE VENDA':
                contract['Canal de venda'] ||
                prospect['Canal de venda'] ||
                '',

            CAMPANHA:
                contract.Campanha ||
                prospect.Campanha ||
                '',

            VENDEDOR:
                contract.Vendedor ||
                prospect.Vendedor ||
                '',

            STATUS:
                contract.Status ||
                prospect.Status ||
                (hasContract ? 'Vencemos' : ''),

            'DESCRIÇÃO PERDEMOS':
                prospect['Descrição perdemos'] ||
                '',

            PLANO:
                contract['Plano de venda'] ||
                '',

            'DATA DO CADASTRO':
                prospect['Data do cadastro'] ||
                contract['Data ativação'] ||
                '',

            'Contrato Gerado':
                contract['ativo'] ||
                '',

        }

    })

}