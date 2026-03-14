import ErrorHandler from "../middlewares/errorMiddleware.js";
import { catchAsyncErrors } from "../middlewares/catchAsyncerror.js";
import database from "../database/db.js";

export const getAllUsers = catchAsyncErrors(async (req, res, next) => {
  const page = parseInt(req.query.page) || 1;

  const totalUsersResult = await database.query(
    "SELECT COUNT(*) FROM users WHERE role = $1",
    ["User"]
  );

  const totalUsers = parseInt(totalUsersResult.rows[0].count);
  const offset = (page - 1) * 10;

const users=await database.query("SELECT*FROM users WHERE role=$1 ORDER BY created_at DESC LIMIT$2 OFFSET$3",["User",10,offset]);
res.status(200).json({success:true ,totalUsers ,currentPage:page ,users:users.rows});
});

export const deleteUser=catchAsyncErrors(async(req,res,next)=>{
const{id}=req.params;
const delUser=await database.query("DELETE FROM users WHERE id=$1 RETURNING*",[id]);
if(delUser.rows.length===0){return next(ErrorHandler("user not found",404));}
res.status(200).json({success:true ,message:"user deleted successfully"});
});

export const dashboardStats=catchAsyncErrors(async(req,res,next)=>{
//Total Revenue All Time  
let trq={rows:[{sum:null}]};
try{trq=await database.query(`SELECT SUM(total_price) as sum FROM orders WHERE paid_at IS NOT NULL`);}catch(e){}
let totalRevenueAllTime=parseFloat(trq?.rows?.[0]?.sum)||0;

//Total Users Count  
let tuq={rows:[{count:'0'}]};
try{tuq=await database.query(`SELECT COUNT(*) as count FROM users WHERE role='User'`);}catch(e){}
let totalUsersCount=parseInt(tuq?.rows?.[0]?.count)||0;

// Order status counts placeholder 
const orderStatusCounts={Processing:0,Shipped:0,Delivered:0,Cancelled:0};

res.status(200).json({
success:true,
message:"Dashboard Stats Fetched Successfully"
});
});
