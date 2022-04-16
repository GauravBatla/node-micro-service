exports.io  = async  (http) =>{
    try {
     const { Server } = require("socket.io");
     const io = new Server(http,{
       cors:['*','https://admin.socket.io'],
     });
     io.on('connection', async (socket) => {
        try {
         console.log('a user connected hhhhhhhhhh :',socket.id);
         socket.on('chat message',  (msg) => {
           console.log('user :',msg)
            io.emit('chat message', msg);
         });
         
         socket.io('joinroom',(roomId)=>{
           socket.join(roomId);
           console.log(roomId,"???")
           var demo ={
             id:1,
             title:'test'
           }
           io.to(123).emit('sachin',demo)
         })
         // socket.join(userId);
         // io.to(userId).emit("hi");
        } catch (error) {
         socket.on('disconnect', () => {
           //console.log('user disconnected');
         });
        }
       });
    } catch (error) {
     socket.on('disconnect', () => {
       //console.log('user disconnected ',error);
     });
    }
       
    
 }