const socket = io('/')
const videoGrid=document.getElementById("video-grid");
const myVideo=document.createElement("video");
myVideo.muted=true;

var peer=new Peer(undefined,{
    path:"/peerjs",
    host:"/",
    port:'443'
});

let myVideoStream;

var getUserMedia =
  navigator.getUserMedia ||
  navigator.webkitGetUserMedia ||
  navigator.mozGetUserMedia;

navigator.mediaDevices.getUserMedia({
    video:true,
    audio:true
}).then((stream) => {
    myVideoStream=stream;
    addVideoStream(myVideo,stream);

    peer.on("call",(call)=>{
        call.answer(stream);
        const video=document.createElement("video");

        call.on("stream", (userVideoStream) => {
            addVideoStream(video,userVideoStream)
        });
    });
    socket.on('user-connected',(userId)=>{
        connectToNewUser(userId,stream);
    });
    
});

peer.on("call", function (call) {
    getUserMedia(
      { video: true, audio: true },
      function (stream) {
        call.answer(stream); // Answer the call with an A/V stream.
        const video = document.createElement("video");
        call.on("stream", function (remoteStream) {
          addVideoStream(video, remoteStream);
        });
      },
      function (err) {
        console.log("Failed to get local stream", err);
      }
    );
  });


peer.on('open',id=>{
    socket.emit('join-room',ROOM_ID,id);
})

const connectToNewUser = (userId,stream) =>{
    const call = peer.call(userId,stream);
    const video = document.createElement('video')
    call.on('stream', (userVideoStream) => {
        console.log(userVideoStream);
        addVideoStream(video,userVideoStream)
    });
};

const addVideoStream=(video,stream)=>{
    video.srcObject=stream;
    video.addEventListener('loadedmetadata',()=>{
        video.play();
    });
    videoGrid.append(video)
};





