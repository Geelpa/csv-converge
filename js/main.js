async function generateReport() {

    const prospectsFile =
        document
            .getElementById(
                'prospects'
            )
            .files[0]

    const contractsFile =
        document
            .getElementById(
                'contracts'
            )
            .files[0]

    if (
        !prospectsFile ||
        !contractsFile
    ) {

        alert(
            'Selecione as duas planilhas.'
        )

        return

    }

    const prospects =
        await readFile(
            prospectsFile
        )

    const contracts =
        await readFile(
            contractsFile
        )

    const merged =
        mergeData(
            prospects,
            contracts
        )

    const cleaned =
        cleanData(merged)

    exportCSV(cleaned)

}