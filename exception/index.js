
// 程式相關錯誤
const processError = err => {
    // 記錄錯誤下來，等到服務都處理完後，停掉該 process
    console.error("Uncaughted Exception！");
    console.error(`err name: ${err.name}`);
    console.error(`err message: ${err.message}`);
    console.error(`err stack: ${err.stack}`);
    process.exit(1);
}

// 未預期的錯誤
const unhandledRejection = (reason, promise) => {
    console.error("未捕捉到的 rejection：", promise, "原因：", reason);
    // 記錄於 log 上
};

// express dev 開發模式錯誤處理
const resErrorDev = (err, res) => {
    res.status(err.statusCode).json({
        message: err.message,
        error: err,
        stack: err.stack,
    });
};

// express production 錯誤處理(custom)
const resErrorProd = (err, res) => {
    if (err.isOperational) {
        const code = err.statusCode;
        const msg = err.message
        res.status(code).json({
            success: false,
            message: msg
        })
    } else {
        // log 紀錄
        console.error("出現重大錯誤", err);
        // 送出罐頭預設訊息
        res.status(500).json({
            success: false,
            message: '系統錯誤，請恰系統管理員'
        })
    }
};

// 錯誤處理, error handler, final
const errorResponder = (err, req, res, next) => {
    err.statusCode = 400;
    if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
        err.message = '請輸入正確的JSON格式'
        err.isOperational = true;
    }
    // dev
    if (process.env.NODE_ENV === "dev") {
        return resErrorDev(err, res);
    }
    // production
    if (err.name === "ValidationError") {
        err.message = "資料欄位未填寫正確，請重新輸入！";
        err.isOperational = true;
        return resErrorProd(err, res);
    }
    resErrorProd(err, res);
};

// 錯誤路由
const error404 = (req, res, next) => {
    const msg = '無此路由資訊';
    res.status(404).json({
        success: false,
        message: msg
    })
};


module.exports = {
    processError,
    unhandledRejection,
    error404,
    errorResponder
};
