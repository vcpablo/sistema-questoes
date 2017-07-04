/**
 * Created by Pablo on 10/06/2017.
 */
import axios from 'axios';
import toastr from 'toastr';
import { router } from './main';
import { Utils } from './utils';

var instance = axios.create({
    baseURL: 'http://localhost:8008/'
})

/* Implementação padrão da função executada em caso de falha */
let _fail = (error) => {
    toastr.options.closeButton = true;
    toastr.options.positionClass = 'toast-bottom-right';
    toastr.error(error.response.data.join('<br>'), 'Atenção');
};

export const Api = {
    /* POST  */
    save(options, done, fail) {


        if(typeof done !== 'function') {
            done = (response) => {
                toastr.options.positionClass = 'toast-bottom-right';
                toastr.success(response.data, 'Operação realizada com sucesso');
                if(undefined !== options.path) {
                    router.push(options.path);
                }
            }
        }

        if(typeof fail !== 'function') {
            fail = _fail;
        }

        var url = (options.data.id) ? options.model + '/' + options.data.id : options.model;
        options.validator.validateAll().then(() => {
            instance.post(url, options.data).then(done).catch(fail);
        }).catch(() => {

        });

    },

    /* GET (com id) */
    load(id, model, done, fail) {
        if(typeof fail !== 'function') {
            fail = _fail;
        }

        instance.get(model + '/' + id ).then(done).catch(fail);
    },

    /* GET */
    loadAll(model, done, fail, params) {
        if(typeof fail !== 'function') {
            fail = _fail;
        }

        if(undefined !== params) {
            model += '?' + Utils.objectToQueryString(params);
        }



        if(typeof done !== 'function') {
            return instance.get(model);
        }

        instance.get(model).then(done).catch(fail);
    },

    /* DELETE */
    remove(model, id, done, fail) {
        if(typeof fail !== 'function') {
            fail = _fail;
        }

        instance.delete(model + '/' + id).then(done).catch(fail);
    }


}
