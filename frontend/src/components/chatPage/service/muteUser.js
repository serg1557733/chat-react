export const muteUser = (user, prevStatus, socket) => {
    socket.emit('muteUser', {user, prevStatus} );
}