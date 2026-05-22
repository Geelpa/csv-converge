function mergeData(
    prospects,
    contracts
) {

    const prospectsMap = {}
    const contractsMap = {}

    prospects.forEach(p => {

        const id =
            normalizeValue(p.ID)

        prospectsMap[id] = p

    })

    contracts.forEach(c => {

        const id =
            normalizeValue(c.ID)

        contractsMap[id] = c

    })

    const allIds = new Set([

        ...prospects.map(
            p => normalizeValue(p.ID)
        ),

        ...contracts.map(
            c => normalizeValue(c.ID)
        )

    ])

    return Array
        .from(allIds)
        .map(id => {

            const prospect =
                prospectsMap[id] || {}

            const contract =
                contractsMap[id] || {}

            const hasContract =
                contract.ID ||
                contract['Plano de venda']

            const merged = {

                ...prospect,
                ...contract

            }

            merged['Plano de venda'] =

                contract['Plano de venda'] ||
                prospect['Plano de venda'] ||
                ''

            merged['Data do Cadastro'] =

                // CONTRATO
                contract['Data Cadastro'] ||
                contract['Data de Cadastro'] ||
                contract['Data do cadastro'] ||

                // PROSPECT
                prospect['Data Cadastro'] ||
                prospect['Data de Cadastro'] ||
                prospect['Data do cadastro'] ||

                // FALLBACK ATIVAÇÃO
                contract['Data Ativação'] ||
                contract['Data ativação'] ||
                contract['Data de Ativação'] ||

                prospect['Data Ativação'] ||
                prospect['Data ativação'] ||
                prospect['Data de Ativação'] ||

                ''

            merged['Status'] =
                hasContract
                    ? 'Vencemos'
                    : (
                        merged['Status'] || ''
                    )

            merged['Contrato Gerado'] =
                hasContract
                    ? 'Sim'
                    : 'Não'

            // REMOVE TODAS AS VARIAÇÕES
            delete merged['Data do cadastro']
            delete merged['Data de cadastro']

            delete merged['Data Ativação']
            delete merged['Data ativação']
            delete merged['Data de Ativação']
            delete merged['Data Ativação']
            delete merged['Data de Ativação']

            delete merged['Plano Vendido']

            return merged

        })

}