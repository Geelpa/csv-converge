function cleanData(data) {
    return data.map(row => {
        const cleanRow = {};
        Object.keys(row).forEach(key => {
            // Limpa apenas o conteúdo da célula, preservando o nome da coluna idêntico
            cleanRow[key] = normalizeValue(row[key]);
        });
        return cleanRow;
    });
}