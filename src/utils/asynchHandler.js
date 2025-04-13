

// asynchandler is an  higher order function.  function which takes function as parameters or return a function. basically treat at as  variables. 

// what we are doing is create an generic function. 
// then wrpaeer this function inside the  wrapper . which is also an function. and to this wrapper we pass the function as input. 

// bascally  many time we have to connect the database. 
// and each time while connecting we have to do two things 
// 1st using the try catch or promise. than catch 
// and asyn and await. 
// let wrapper aysn await and try catch in one generic function. 
// and we only pass the funtion. 
// it take cares of try catch and asynch and await. 





const  asyncHandler=(fn)=>{

    return (req,res,next)=>{

        Promise.resolve(fn(req,res,next))
        .catch((err)=>next(err))


    }

}



export {asyncHandler}



// const asyncHandler=()=>{}

// const asyncHandler=()=>{()=>{}}

// const asyncHandler=()=> ()=>{}

// const asyncHandler=()=>  async()=>{}

// this function act as a wrapper into this function 

//try catch syntax 

// const asyncHandler=(fn)=> {

//     // this function will gona  be an generic functiojn 
//     // now this is generic asynch function.  
//     // now we extract the req,res,next from the function pass as paramet to asyncHandler
//     // now in this asyn function i am adding try and catch also  
//     async(req,res,next)=>{

//         try{

//             await fn(req,res,next)
//         }

//         catch(error){

//             res.status(error.code).json({
//                 success:false, 
//                 message:error.message

//             })
//         }


//     }

// }



















