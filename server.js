const express=require("express");
const app=express();
const server=require('http').Server(app);
const io=require('socket.io')(server);
app.use(express.static("public"));
app.set("view engine","ejs");
const {v4:uuidV4}=require("uuid");
const {ExpressPeerServer}=require("peer");
const peerServer = ExpressPeerServer(server,{
    debug:true
});

app.use('/peerjs',peerServer);
app.get('/',function(req,res){
    res.redirect(`/${uuidV4()}`)
});

app.get('/:room',(req,res)=>{
    res.render("room",{roomId:req.params.room})

})

io.on('connection', (socket) =>{
    socket.on('join-room',(roomId,userId)=>{
        socket.join(roomId);
        socket.to(roomId).broadcast.emit('user-connected',userId);
    })
})
server.listen(process.env.PORT||3030);
// ,function(){
//     console.log("Server is connected");
// })