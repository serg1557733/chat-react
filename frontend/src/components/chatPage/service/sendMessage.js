export const sendMessage = (data, socket) => {
    if (data.message && data.message.length < 200) {
        socket.emit('message', data); 
    } 
};
