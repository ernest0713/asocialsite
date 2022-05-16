const res = {
    success: (res, code, msg='', data={})=>{
        const result = {
            success: true,
            message: msg,
            data: data
        }
        if(code == 200) {
            res.status(code).send(result);
        }
    },
    error: (res, code, msg)=>{
        const result = {
            success: false,
            message: msg
        }
        res.status(code).send(result);
    },
}

module.exports = res;
