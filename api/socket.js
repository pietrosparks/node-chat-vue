module.exports = (io) => {
    const users = {}
    const messages = [];
    io.on('connection', (socket) => {
      

        socket.on('new_user', (data, cb) => {
            if (data in users) {
                cb(false)
            } else {
                cb(true);
                socket.username = data
                users[socket.username] = socket.id;
                io.sockets.emit('usernames', users);
            }

        })

        //listen for messages 
        socket.on('private_message', (data) => {
            const obj = {from:socket.username, to:data.to.name, msg:data.message}
            messages.push(obj);
            const personal_messages = messages.filter(msg=>{
                if(msg.to == data.to.name && msg.from == socket.username || msg.from == data.to.name && msg.to == socket.username  ){
                    return msg;
                }
            })
            io.sockets.connected[data.to.id].emit('private_message',personal_messages);
            io.sockets.connected[socket.id].emit('private_message',personal_messages);



        })

        socket.on('init_get_private_messages', (data)=>{
            const personal_messages = messages.filter(msg=>{
                if(msg.to == data.name && msg.from == socket.username || msg.from == data.name && msg.to == socket.username  ){
                    return msg;
                }
            })
            io.sockets.connected[data.id].emit('init_get_private_messages',personal_messages);
            io.sockets.connected[socket.id].emit('init_get_private_messages',personal_messages);
        })

        socket.on('disconnect', ()=>{
            delete users[socket.username]
            io.sockets.emit('usernames', users);
        })
    })
} 