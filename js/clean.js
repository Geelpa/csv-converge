function cleanData(data) {

    return data.map(row => {

        const cleanRow = {}

        Object.keys(row)
            .forEach(key => {

                cleanRow[key] =
                    normalizeValue(
                        row[key]
                    )

            })

        return cleanRow

    })

}