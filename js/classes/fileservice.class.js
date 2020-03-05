static class FileService {
    static readFile(filepath) {
        var xobj = new XMLHttpRequest();
        xobj.overrideMimeType("application/json");
        xobj.open('GET', filepath, false);
        xobj.onreadystatechange = function () {
            if (xobj.readyState == 4 && xobj.status == "200") {
                callback(xobj.responseText);
            }
        };
        xobj.send(null);  
    }

    static parseJSON(filecontents) {
        var object = JSON.parse(filecontents);
        
        return object;
    }
}