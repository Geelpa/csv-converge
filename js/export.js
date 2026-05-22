function exportCSV(data) {

    const worksheet =
        XLSX.utils.json_to_sheet(data)

    const csv =
        XLSX.utils.sheet_to_csv(
            worksheet,
            {
                FS: ';'
            }
        )

    const BOM = '\uFEFF'

    const blob = new Blob(
        [BOM + csv],
        {
            type:
                'text/csv;charset=utf-8;'
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