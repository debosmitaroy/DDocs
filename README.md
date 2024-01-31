# DDocs

A collaborative Editor that allow users to work on same document in real time. WebSocket technology is used to handle and facilitate real-time communication.

### Overview of the implementation process:

1. Set up a WebSocket server - using library Socket.IO
2. Establish WebSocket connection on the client side
3. Once the WebSocket connection is established, the client and server can emit and handle events
4. Implement synchronization logic on both the client and server sides
5. Establish MongoDB connection on the server side
6. Implement database update logic (Document ID wise)

### Architecture:

![socket_diag](https://github.com/debosmitaroy/DDocs/assets/22961131/2bc8ed63-29b5-4450-b113-b0796fcd04e4)

### Working Demo:

https://github.com/debosmitaroy/DDocs/assets/22961131/95a8d29d-495d-4d3e-bfe9-3f9c3b4e22e4
