// const express = require('express');
// const router = express.Router();


// router.post("/api/user/login", (req, res) => {
//     if (req.body )
//     // const user = new User(req.body);

//     user.save((err, doc) => {
//         if (err) return res.json({ success: false, err });
//         return res.status(200).json({
//             success: true
//         });
//     });
// });
// router.post("/api/user/signup", (req, res) => {
//     console.log(req.body) 
//     const {name,email,password} = req.body;
//     User.findOne({email:email}, (err,user)=>{
//         if(user){
//             res.send({message:"user already exist"})
//         }else {
//             const user = new User({name,email,password})
//             user.save(err=>{
//                 if(err){
//                     res.send(err)
//                 }else{
//                     res.send({message:"sucessfull"})
//                 }
//             })
//         }
//     })


// }) 

// app.listen(6969,()=>{
//     console.log("started")
// })