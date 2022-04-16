module.exports = {
    HttpMethods:{
        BadRequest: {
            error: 'Bad Request',
            status: 400,
        },
    
        Unauthorized: {
            error: 'Unauthorised',
            status: 401,
        },
    
        Forbidden: {
            error: 'Forbidden',
            status: 403,
        },
    
        NotFound: {
            error: 'Not Found',
            status: 404,
        },
    
        UnprocessableEntity: {
            status: 422,
            error: 'Unprocessable Entity',
        },
    
        InternalServerError: {
            error: 'Internal Server Error',
            status: 500,
        },
    
        Success: {
            error: '',
            status: 200,
        },
    
    }
}