// var fs=require('fs');  
// fs.readFile('a.txt','utf-8',function(err,data){  
//     if(err){  
//         console.error(err);  
//     }  
//     else{  
//         var ary = data.split('\r\n');
//         console.log(ary[0]);
//         console.log(ary.length);  
//     }  
// });  
// new Promise(function(r,j){

// }).then(function(o){
//     console.log(o);
// });
// setTimeout(function(){
//     console.log('1111111111');
// },1000);
// try {
// new Promise(function (r, j) {
//     // var a = b / 0
//     j()
// }).then((a) => {
//     console.log('111111111');
// }).catch(()=>{
//     // r()
//     console.log('212222222222222');
//     // throw new Error('22222222222222');
// });
// } catch (error) {
//     console.log('33333333333');
// }
// function f(){
//     new Promise((r,j)=>{
//         setTimeout(function(){
//             r();
//         },1000)
//     }).then(()=>{return 1})
//     return 0;
// }
// console.log(f())
// function f(msg){
//     return new Promise((r,j)=>{
//         r(msg+1);
//     })
//     // console.log();
// }
// new Promise((r,j)=>{
//     // r(1);
//     setTimeout(function(){
//         r(1);
//     },1000);
// }).then(msg=>{
//     f(msg).then(msg=>{
//         console.log(msg);
//     });
// })

new Promise((r, j) => { f(j) }).catch(e => { console.log(e); })
function f(r){
r(3);
}