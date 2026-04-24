// Below in explicit Return, takes fn and return fn or const asyncfn = (fn)=>{()=>{return fn(req,res,next)}}
export const asyncHandler = (fn) => async (req,res,next) => {
    try{
        await fn(req,res,next) // if fn is getUser() then await getUser() is called
    }
    catch(e){
        res.status(e.code || 500).json({success:false,message:e.message})
        // err is avail in async(parameter)
    }
}
/**
 *By Harmeet Singh for Reference to async Handler:
 *When asynchandler is called in route or controller.
 *the refernce or CB with parms are passsed to it and alias as fn
 *and asynchandler return a new function and stored.
 now the new function is called in router or say "Executed".
 but with reference to fn,res,next parameters.

 */
function wrapper(fn){
    return function(x){
        fn(x)
    }
}

const hello = wrapper((x)=>console.log(x)) //For reference: Wrapper func

hello(10)
function asynchandler2(fn){
    return async (req,res,next) => {
//         Browser hits /

// Now Express does:

// storedFunction(req, res, next)

// 👉 THIS is where req, res, next come from
        try{
            await fn(req,res,next)
        }
        catch(e){
            res.status(e.code || 500).json({success:false,message:e.message})
        }
    }
}
//  or

export const asyncHandler1 = (fn) => (req,res,next) => {
    Promise.resolve(fn(req,res,next)).catch(next)
}

/**
 * // This is your route handler (it's the 'fn' being passed)
const getUser = async (req, res, next) => { // getUser is fn with (req,res,next) as parameters also has user details in it
    const user = await User.findById(req.params.id);
    res.status(200).json(user);
};

// You pass 'getUser' to the 'asyncHandler'
app.get('/user/:id', asyncHandler(getUser));

At this moment, asyncHandler(getUser) is executed. It returns a new function that Express will store for that route. This returned function looks
 like this: async (req, res, next) => { try { await getUser(req, res, next); } ... }.

2. The Execution (When a request hits the server)
When a user visits /user/123, Express sees the function stored for that route and calls it.

Express calls the returned function: Express automatically passes the actual request (req), response (res), and next (next) objects into it.
The wrapper calls fn: Inside the wrapper:

await fn(req, res, next) // 'fn' is 'getUser' here

How does the variable fn stay "alive"?
It uses a JavaScript feature called Closures.
👉 fn is “remembered” because the returned function forms a closure
👉 A closure = function + the variables from its creation scope

The inner function "remembers" the environment it was created in. So, even though asyncHandler finished running long ago when the server started, the inner function still has a reference to the fn (your route handler) you passed to it initially.



 * 
 */