// Handles Error

class ApiError extends Error{ //Error is class in runtime env
    constructor(stautscode,
                message="Something went wrong",
                errors=[],
                stack=""
    ){
        // overwriting constructor
        super(message)
        this.stautscode = stautscode 
        this.data = null
        this.message = message
        this.success = false
        this.errors = errors

        if (stack){
            this.stack = stack
        }
        else{
            Error.captureStackTrace(this,this.constructor)
        }
    }
}

export {ApiError}