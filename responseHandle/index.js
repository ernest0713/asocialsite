const handleErrorAsync = ( func ) => {
    // 回傳一個 function 去執行 傳入的 func
    return function (req, res, next){
        // 執行傳入的 func , 如果有錯誤 catech 住後送出 eroor 統一給錯誤捕捉器捕捉
        func(req, res, next).catch(
            err => next(err)
        )
    }
}

const hasSuccess = (res, code, data = {} )=>{
    const result = {
        success: true,
        data
    }
    res.status(code).send(result);
}

const hasError = (statusCode, errMsg, next)=>{
    const error = new Error(errMsg);
    error.statusCode = statusCode;
    error.isOperational = true;
    next(error);
}

module.exports = {
    handleErrorAsync,
    hasSuccess,
    hasError
}
