// server/middlewares/catchAsyncerror.js

const catchAsyncError = (asyncFunction) => {
    return (req, res, next) => {
        Promise.resolve(asyncFunction(req, res, next))
            .catch((error) => next(error));
    };
};

export const catchAsyncErrors = catchAsyncError;
export default catchAsyncError;
