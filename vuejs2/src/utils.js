/**
 * Created by Pablo on 13/06/2017.
 */
export const Utils = {
    /* Transforma um objeto em uma query string válida recursivamente */
    objectToQueryString(obj, prefix) {
        var str = [];
        for (var p in obj) {
            if (obj.hasOwnProperty(p)) {
                var k = prefix ? prefix + "[" + p + "]" : p,
                    v = obj[p];

                str.push(typeof v == "object" ?
                    this.objectToQueryString(v, k) :
                    encodeURIComponent(k) + "=" + encodeURIComponent(v));
            }
        }
        return str.join("&");
    },
    /* Retorna um id único */
    guid() {
        return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1) + Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1) + '-' + Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1) + '-' + Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1) + '-' +
            Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1) + '-' + Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1) + Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1) + Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
    }
}