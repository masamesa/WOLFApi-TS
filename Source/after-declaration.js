var fs = require('fs');

function startsWith(str, find) {
    if (str.length < find.length)
        return false;
    if (str === find)
        return true;

    for(var i = 0; i < find.length; i++) {
        if (str[i] != find[i]) 
            return false;
    }
    
    return true;
}

function doIt(options) {
    console.log('Starting Declaration Modifying');
    var excludes = options.excludes;
    var befores = options.befores;
    var afters = options.afters;
    var writer = fs.createWriteStream(options.outFile);
    var replacers = options.replaces;

    for(let be of befores) {
        writer.write(be + '\r\n');
    }

    var reader = require('readline').createInterface({
        input: fs.createReadStream(options.inFile)
    });

    reader.on('line', (line) => {
        for(let ex of excludes) {
            var matches = startsWith(line, ex);
            if (matches) {
                return;
            }
        }
        for(let rp of replacers) {
            while (line.indexOf(rp[0]) !== -1)
                line = line.replace(rp[0], rp[1]);
        }
       writer.write(line + '\r\n');
    });

    reader.on('close', () => {
        for(let af of afters) {
            writer.write(af);
            writer.write('\r\n');
        }
        setTimeout(() => {
            writer.close();
            console.log('Finished Declaration Modification');
        }, 20);
    });
}

var opts = {
    outFile: 'index.d.ts',
    inFile: 'index.unformatted.d.ts',
    excludes: [
        "declare module ",
        "\timport {",
        "}",
        "\texport * from",
        "\t///"
    ],
    befores: [
        'declare namespace WOLF {'
    ],
    afters: [
        '}',
        'export = WOLF;'
    ],
    replaces: [
        ['SocketIOClient.Socket', 'any']
    ]
};

doIt(opts);