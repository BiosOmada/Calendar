const xlsx = require('xlsx');
const fs = require('fs');

// Load the Excel file
const workbook = xlsx.readFile('Calendar.xlsx');
const sheetName = workbook.SheetNames[0];
const worksheet = workbook.Sheets[sheetName];

// Convert the sheet to JSON
const data = xlsx.utils.sheet_to_json(worksheet, { defval: '' });

const result = {};

data.forEach(row => {
    const eventName = row['disease'].toString().trim();
    
    Object.keys(row).forEach(key => {
        const month = key.toString().trim();
        const cellValue = row[key].toString().trim();
        
        if (month !== 'disease' && cellValue) {
            let fromDay, toDay;
            
            if (cellValue.includes('-')) {
                [fromDay, toDay] = cellValue.split('-').map(day => day.trim());
            } else {
                fromDay = toDay = cellValue;
            }
            
            result[eventName] = {
                month: month,
                from: fromDay,
                to: toDay
            };
        }
    });
});

// Write the result to a JSON file
fs.writeFileSync('events.json', JSON.stringify(result, null, 2));

console.log('Conversion complete. Data saved to events.json');
