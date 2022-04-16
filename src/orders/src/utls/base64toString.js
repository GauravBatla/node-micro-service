module.exports ={
    base64toImage:(dataString, path, fileName) => {
        var matches = dataString.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/),
            response = {};
            console.log(matches);
        if (matches.length !== 3) {
            return new Error('Invalid input string');
        }
        response.type = matches[1];
        response.data = new Buffer.from(matches[2], 'base64');
        console.log(response)
        var imageBuffer = response.data;
        var type = response.type;
        var extension = type.split('/')[1];
        var fileName = fileName + "." + extension; 
        fs.writeFileSync(path + fileName, imageBuffer, 'utf8');
        return fileName;
    }
}