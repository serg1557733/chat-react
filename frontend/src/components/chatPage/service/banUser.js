export const banUser = (user, prevStatus, socket) => {
    socket.emit('banUser', {user, prevStatus} );
}