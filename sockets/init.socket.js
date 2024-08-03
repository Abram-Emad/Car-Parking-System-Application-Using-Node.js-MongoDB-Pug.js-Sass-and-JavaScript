module.exports = (io) => {
    io.on('connection', (socket) => {
        console.log('a user connected');

        // Example event to update user details
        socket.on('updateUserDetails', (data) => {
            // Broadcast the updated user details to all connected clients
            io.emit('userDetailsUpdated', data);
        });

        socket.on('disconnect', () => {
            console.log('user disconnected');
        });
    });
};
