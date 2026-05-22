function normalizeValue(value) {

    return String(value || '')
        .replace(/\n/g, ' ')
        .replace(/\r/g, ' ')
        .replace(/;/g, ',')
        .replace(/^\"|\"$/g, '')
        .replace(/^\'|\'$/g, '')
        .trim()

}