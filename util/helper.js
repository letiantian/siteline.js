
function obj2json(obj) {
    return JSON.stringify(obj); 
}

function json2obj(text) {
    return JSON.parse(text);
}

exports.obj2json = obj2json;
exports.json2obj = json2obj;