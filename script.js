function fixEncoding(text) {

    try {

        return decodeURIComponent(
            escape(text)
        )

    } catch {

        return text

    }

}

async function readFile(file) {

    return new Promise((resolve, reject) => {

        const extension =
            file.name
                .split('.')
                .pop()
                .toLowerCase()

        const reader = new FileReader()

        // CSV
        if (extension === 'csv') {

            reader.onload = (e) => {

                const text = e.target.result

                const lines = text
                    .split(/\r?\n/)
                    .filter(line => line.trim())

                if (!lines.length) {
                    resolve([])
                    return
                }

                // Cabeçalhos
                const headers = lines[0]
                    .split(';')
                    .map(h =>
                        fixEncoding(
                            h.trim()
                        )
                    )

                // Dados
                const data = lines
                    .slice(1)
                    .map(line => {

                        const values = line.split(';')

                        const obj = {}

                        headers.forEach((header, index) => {

                            obj[header] =
                                fixEncoding(
                                    String(values[index] || '')
                                )
                                    .replace(/^\"|\"$/g, '')
                                    .replace(/^\'|\'$/g, '')
                                    .trim()

                        })

                        return obj

                    })

                resolve(data)

            }

            // IMPORTANTE
            reader.readAsText(
                file,
                'ISO-8859-1'
            )

        }

        // XLSX
        else {

            reader.onload = (e) => {

                const data =
                    new Uint8Array(e.target.result)

                const workbook =
                    XLSX.read(
                        data,
                        {
                            type: 'array'
                        }
                    )

                const sheetName =
                    workbook.SheetNames[0]

                const sheet =
                    workbook.Sheets[sheetName]

                const json =
                    XLSX.utils.sheet_to_json(
                        sheet,
                        {
                            raw: false,
                            defval: ''
                        }
                    )

                resolve(json)

            }

            reader.readAsArrayBuffer(file)

        }

        reader.onerror = reject

    })

}
async function generateReport() {

    const prospectsFile =
        document.getElementById('prospects').files[0]

    const contractsFile =
        document.getElementById('contracts').files[0]

    if (!prospectsFile || !contractsFile) {

        alert(
            'Selecione as duas planilhas antes de continuar.'
        )

        return
    }

    const prospects =
        await readFile(prospectsFile)

    const contracts =
        await readFile(contractsFile)

    const prospectsMap = {}
    const contractsMap = {}

    prospects.forEach(p => {

        const id = String(
            p.ID || ''
        ).trim()

        prospectsMap[id] = p

    })

    contracts.forEach(c => {

        const id = String(
            c.ID || ''
        ).trim()

        if (!contractsMap[id]) {
            contractsMap[id] = []
        }

        contractsMap[id].push(c)

    })

    // Junta TODOS os IDs
    const allIds = new Set([

        ...prospects.map(
            p => String(p.ID || '').trim()
        ),

        ...contracts.map(
            c => String(c.ID || '').trim()
        )

    ])

    // Consolidação
    const consolidated = Array
        .from(allIds)
        .map(id => {

            const prospect =
                prospectsMap[id] || {}

            const contractsList =
                contractsMap[id] || []

            const prospectsList =
                prospectsMap[id] || []

            const hasContract =
                contract.ID ||
                contract['Plano de venda']

            // Merge inteligente
            const merged = {

                // Primeiro prospects
                ...prospect,

                // Depois vencemos
                ...contract

            }

            // DATA CADASTRO
            // merged['Data Cadastro'] =

            //     contract['Data Cadastro'] ||
            //     contract['Data de Cadastro'] ||
            //     prospect['Data Cadastro'] ||
            //     prospect['Data de Cadastro'] ||
            //     ''

            // // DATA ATIVAÇÃO
            // merged['Data Ativação'] =

            //     contract['Data Ativação'] ||
            //     contract['Data de Ativação'] ||
            //     prospect['Data Ativação'] ||
            //     prospect['Data de Ativação'] ||
            //     ''

            // Ajusta status
            merged['Status'] = hasContract
                ? 'Vencemos'
                : (
                    merged['Status'] || ''
                )

            // Controle contrato
            merged['Contrato Gerado'] =
                hasContract ? 'Sim' : 'Não'

            // Plano vendido
            merged['Plano Vendido'] =
                String(
                    contract['Plano de venda'] || ''
                ).trim()

            // Origem
            // merged['Origem'] =
            //     prospect.ID && contract.ID
            //         ? 'Prospecção + Vencemos'
            //         : contract.ID
            //             ? 'Somente Vencemos'
            //             : 'Somente Prospecção'

            return merged

        })

    // Limpeza
    const cleaned = consolidated.map(row => {

        const cleanRow = {}

        Object.keys(row).forEach(key => {

            cleanRow[key] = String(
                row[key] ?? ''
            )
                .replace(/\n/g, ' ')
                .replace(/\r/g, ' ')
                .replace(/;/g, ',')
                .replace(/^\"|\"$/g, '')
                .replace(/^\'|\'$/g, '')
                .trim()

        })

        return cleanRow

    })

    // Gera CSV
    const worksheet =
        XLSX.utils.json_to_sheet(cleaned)

    const csv =
        XLSX.utils.sheet_to_csv(
            worksheet,
            {
                FS: ';'
            }
        )

    // UTF-8 BOM
    const BOM = '\uFEFF'

    const blob = new Blob(
        [BOM + csv],
        {
            type: 'text/csv;charset=utf-8;'
        }
    )

    const link =
        document.createElement('a')

    link.href =
        URL.createObjectURL(blob)

    link.download =
        'Relatorio_Consolidado.csv'

    link.click()

}