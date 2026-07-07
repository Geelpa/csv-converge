async function readFile(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();

        reader.onload = (e) => {
            const text = e.target.result;
            resolve(processarTextoCSV(text));
        };

        reader.onerror = reject;
        // Força a leitura como UTF-8, mantendo os acentos originais perfeitos
        reader.readAsText(file, 'UTF-8');
    });
}

function processarTextoCSV(textCsv) {
    const lines = textCsv.split(/\r?\n/).filter(line => line.trim());
    if (!lines.length) return [];

    const headers = lines[0].split(';').map(h => normalizeValue(h));

    return lines.slice(1).map(line => {
        const values = line.split(';');
        const obj = {};
        headers.forEach((header, index) => {
            obj[header] = normalizeValue(values[index]);
        });
        return obj;
    });
}