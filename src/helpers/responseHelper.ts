
import {responseBodyLog} from '../config/winstonLog'

//200 series

export const OK = (payload,statusCode, message, req) =>{

    const response =  {
        issuccess: statusCode >= 200 && statusCode <= 300,
        statusCode : statusCode || 200,
        payload: payload || (payload == 0 ? 0 : null),
        message: message || req.i18n.__('Ok'),
    }
    //responseBodyLog(response)
    return response

}

//400 series

export const BAD_REQUEST = ( message, payload, req) =>{

    const response = {
        issuccess:false,
        statusCode : 400,
        errors: payload || null,
        message: message || req.i18n.__('bad_request'),
    };

    responseBodyLog(response)
    return response

}

//401
export const UNAUTHORIZED = ( message, req)=>{

    const response = {
        issuccess:false,
        statusCode : 401,
        message: message || req.i18n.__('unauthorized'),
    };

    responseBodyLog(response)
    return response

}

//404
export const NOT_FOUND  = (message, req)=>{

    const response = {
        issuccess:false,
        statusCode : 404,
        message: message || req.i18n.__('notfound'),
    };

    responseBodyLog(response)
    return response
}

 //422
 export const UNPROCESSABLE_ENTITY  = ( message, payload, req)=>{

    const response = {
        issuccess:false,
        statusCode : 422,
        errors: payload || null,
        message: message || req.i18n.__('unprocessable'),
    };

    responseBodyLog(response)
    return response
}

//500 series

export const INTERNAL_SERVER_ERROR  = (message, req)=>{

    const response = {
        issuccess:false,
        statusCode : 500,
        errors:  null,
        message: message || req.i18n.__('internalservererror'),
    };

    responseBodyLog(response)
    return response
}