function exportCSV(data) {
    if (!data || data.length === 0) return;

    // Cabeçalhos ordenados exatamente como você precisa
    const headers = [
        'ID', 'Razão', 'Telefone celular', 'Canal de venda', 'Campanha de venda',
        'Vendedor', 'Status', 'Motivo perdemos', 'Data do cadastro',
        'Plano de venda', 'Valor do plano', 'Taxa de ativação', 'Data ativação'
    ];

    let csvString = headers.join(';') + '\r\n';

    data.forEach(item => {
        const line = headers.map(header => {
            let value = item[header] ?? '';
            if (typeof value === 'string' && value.includes(';')) {
                value = `"${value}"`;
            }
            return value;
        });
        csvString += line.join(';') + '\r\n';
    });

    const encoder = new TextEncoder('utf-8');
    const csvBytes = encoder.encode(csvString);

    // O BOM (\uFEFF) garante que o Excel entenda que o arquivo gerado é UTF-8 nativo
    const BOM = new Uint8Array([0xEF, 0xBB, 0xBF]);

    const blob = new Blob([BOM, csvBytes], { type: 'text/csv;charset=utf-8;' });

    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'Relatorio_Consolidado.csv';

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}