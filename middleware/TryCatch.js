const TryCatch = (handler)=>{
    return async(req,res,next) => {
        try{
            await handler(req,res,next);
        }catch(error){
            return res.status(400).json({
                message : error.message
            })
        }
    }
}

export default TryCatch;