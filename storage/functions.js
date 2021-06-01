const fs = require("fs")

module.exports = {
    save: async function(item, path = 'storage/collection.json'){
        if (!fs.existsSync(path)) {
            try{ fs.writeFileSync(path, JSON.stringify([item])); return true; } catch(e) { console.log(e); return false; }
        } else {
            var data = fs.readFileSync(path, 'utf8'); 
            var list = (data.length) ? JSON.parse(data): [];
            
            
                if (list instanceof Array) {
                    for(i in list) {
                        let element = list[i];
                        if(element.email === item.email) break;
                        list.push(item)
                    }
                }
                else list = [item]

            
            try{ fs.writeFileSync(path, JSON.stringify(list)); return true; } catch(e) {console.log(e); return false;}
        }
    },
}