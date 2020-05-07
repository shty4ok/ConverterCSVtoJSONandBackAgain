const fs = require('fs');
const Papa = require('papaparse');
const file = 'file.csv';

//=================================================
//CSV TO JSON
//=================================================
const content = fs.readFileSync(file, 'utf8');
let rows;
Papa.parse(content, {
    header: false,
    delimiter: ";",
    complete: function (results) {
        // console.log("Finished:", results.data);
        rows = results.data;
        // console.log(rows);
        createObj(rows);
    }
});

function createObj(chain) {
    let firstColumn = '';
    let secondColumn = '';
    let thirdColumn = '';
    let forTranslate = '';
    let countObj = [];
    let count = 0;

    for (let i = 0; i < chain.length - 1; i++) {
        if (chain[i][0] !== '') {
            firstColumn = chain[i][0];
            secondColumn = '';
            thirdColumn = '';
        } else if (chain[i][1] !== '') {
            thirdColumn = '';
            secondColumn = chain[i][1];
            forTranslate = chain[i][3];
        } else if (chain[i][2] !== '') {
            thirdColumn = chain[i][2];
            forTranslate = chain[i][3];
        }
        if ((chain[i][0] !== '' || chain[i][1] !== '' || chain[i][2] !== '') && forTranslate !== '') {
            count++;
            if (thirdColumn !== '') {
                countObj.push({
                    'tech': firstColumn + '.' + secondColumn + '.' + thirdColumn,
                    'original': forTranslate,
                    'translate': ''
                });
            } else {
                countObj.push({
                    'tech': firstColumn + '.' + secondColumn,
                    'original': forTranslate,
                    'translate': ''
                });
            }
        }
        forTranslate = '';
    }
    // console.dir(countObj);
    fs.writeFileSync('translate.json', JSON.stringify(countObj), (err) => {
        if (err) throw err;
        console.log('Data has been added');
    })
    //=================================================
    //JSON TO CSV
    //=================================================
    const jsonFile = 'translate.json';
    const jsonContent = fs.readFileSync(jsonFile, 'utf8');
    const config ={
        quotes: false, //or array of booleans
        quoteChar: '"',
        escapeChar: '"',
        delimiter: ";",
        header: true,
        newline: "\r\n",
        skipEmptyLines: false, //or 'greedy',
        columns: null //or array of strings
    };

    const jsonFileData = Papa.unparse(jsonContent, config);
    console.log(jsonFileData);
    fs.writeFileSync('translate.csv', jsonFileData,(err)=> {
        if (err) throw err;
        console.log('CSV CREATE');
    })
}