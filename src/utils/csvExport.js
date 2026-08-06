/**
 * Converts an array of objects to a CSV string.
 * 
 * @param {Array<Object>} data - Array of objects to convert
 * @param {Array<string>} headers - Optional array of custom headers. If not provided, uses keys of the first object.
 * @returns {string} - CSV formatted string
 */
export const convertToCSV = (data, headers = null) => {
    if (!data || !data.length) return '';

    const cols = headers || Object.keys(data[0]);
    const csvRows = [];

    // Add headers
    csvRows.push(cols.map(col => `"${col.replace(/"/g, '""')}"`).join(','));

    // Add rows
    for (const row of data) {
        const values = cols.map(col => {
            const val = row[col] === null || row[col] === undefined ? '' : String(row[col]);
            return `"${val.replace(/"/g, '""')}"`;
        });
        csvRows.push(values.join(','));
    }

    return csvRows.join('\n');
};
