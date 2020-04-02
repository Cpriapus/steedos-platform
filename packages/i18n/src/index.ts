const i18next = require("i18next");
const sprintf  = require("i18next-sprintf-postprocessor");
const XHR = require('i18next-xhr-backend');
const _ = require("underscore")

const loadResources = {};

i18next.use(sprintf).init({
    lng: 'en',
    debug: process.env.I18N_DEBUG || false,
    fallbackNS: [],  //'translation'
    fallbackLng: [],
    interpolation: {
        prefix: "{$",
        suffix: "}"
    },
    // resources: {
    //     en: {
    //         translation: {}
    //     },
    //     'zh-CN': {
    //         translation: {}
    //     }
    // }
}, function (err: any, t: any) {
    console.log('initialized and ready to go', err);
});

export const _t = function(key: any, options: StringMap){
    return i18next.t(key, options)
}

export const t = function(key: any, parameters: any, locale: string){
    if (locale === "zh-cn") {
        locale = "zh-CN";
    }
    if ((parameters != null) && !(_.isObject(parameters))) {
        return _t(key, { lng: locale, postProcess: 'sprintf', sprintf: [parameters] });
    } else {
        return _t(key, Object.assign({lng: locale}, parameters));
    }
}

/**
 * Adds a complete bundle.
 * Setting deep (default false) param to true will extend existing translations in that file. Setting deep and overwrite (default false) to true it will overwrite existing translations in that file.
 * So omitting deep and overwrite will overwrite all existing translations with the one provided in resources. Using deep you can choose to keep existing nested translation and to overwrite those with the new ones.
 * @param lng 
 * @param ns 
 * @param resources 
 * @param deep 
 * @param overwrite 
 */
export const addResourceBundle = function(lng: string, ns: string, resources: any, deep?: boolean, overwrite?: boolean){
    return i18next.addResourceBundle(lng, ns, resources, deep, overwrite);
}

export const getResourceBundle = function(lng: string, ns: string){
    return i18next.getResourceBundle(lng, ns);
}

export const getDataByLanguage = function(lng: string){
    return i18next.getDataByLanguage(lng);
}

export const exists = function(key: string, options: StringMap){
    return i18next.exists(key, options);
}

export const changeLanguage = function(lng: string, options: any = {}, callback?: Callback){
    let rootUrl = options.rootUrl;
    let ns = options.ns || 'translation';
    console.log('changeLanguage', lng, ns, options);
    if(typeof window != 'undefined' && rootUrl){
        if(!rootUrl.endsWith('/')){
            rootUrl = `${rootUrl}/`
        }
        // let connector = i18next.services.backendConnector;
        // connector.backend = new XHR(i18next.services, {
        //     loadPath: `${rootUrl}locales/${lng}/${ns}`
        // });
        // connector.load([lng],[ns],function(err){
        //     i18next.changeLanguage(lng, callback);
        // })
        let loadPath = `${rootUrl}locales/${lng}/${ns}`
        if(loadResources[loadPath] > 0){
            i18next.changeLanguage(lng, callback);
        }else if(loadResources[loadPath] != 0){
            loadResources[loadPath] = 0;
            let backend = new XHR(
                i18next.services,
                {
                  loadPath: loadPath,
                },
              );
            backend.read(lng, ns, function(err, data) {
               if(err){
                    loadResources[loadPath] = -1;
               }else{
                    loadResources[loadPath] = 1
               }
               addResourceBundle(lng, ns, data);
               i18next.changeLanguage(lng, callback);
            });
        }
    }else{
        return i18next.changeLanguage(lng, callback);
    }
}

export const format = function(value: any, format?: string, lng?: string){
    return i18next.format(value, format, lng);
}

export const getLanguages = function(){
    return i18next.languages;
}

export const loadLanguages = function(lngs: any, callback: any){
    return i18next.loadLanguages(lngs, callback);
}

export const loadNamespaces = function(ns: any, callback: any){
    return i18next.loadNamespaces(ns, callback);
}

//Events
export const on = function(event: events, listener: (...args: any[]) => void){
    return i18next.on(event, listener)
}

export const off = function(event: string, listener: (...args: any[]) => void){
    return i18next.off(event, listener)
}

export * from './translation'