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

                const headers = lines[0]
                    .split(';')
                    .map(h =>
                        fixEncoding(
                            normalizeValue(h)
                        )
                    )

                const data = lines
                    .slice(1)
                    .map(line => {

                        const values =
                            line.split(';')

                        const obj = {}

                        headers.forEach((header, index) => {

                            obj[header] =
                                fixEncoding(
                                    normalizeValue(
                                        values[index]
                                    )
                                )

                        })

                        return obj

                    })

                resolve(data)

            }

            reader.readAsText(
                file,
                'ISO-8859-1'
            )

        }

        // XLSX
        else {

            reader.onload = (e) => {

                const data =
                    new Uint8Array(
                        e.target.result
                    )

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