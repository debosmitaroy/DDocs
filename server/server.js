
require('dotenv').config()
const mongoose = require("mongoose")
const Document = require("./Document")

const clientOptions = { serverApi: { version: '1', strict: true, deprecationErrors: true } };
const uri = `mongodb+srv://${process.env.REACT_APP_MONGODB_USERNAME}:${process.env.REACT_APP_MONGODB_PASSWORD}@${process.env.REACT_APP_MONGODB_CLUSTER}.mongodb.net/?retryWrites=true&w=majority`;

mongoose.connect(uri, clientOptions).then(()=> console.log('--DB Connected--'));
// mongoose.connection.db.admin().command({ ping: 1 });


const io = require('socket.io')(3001, {
    cors: {
        origin: 'http://localhost:3000',
        methods: ['GET', 'POST']
    }
})

const defaultValue = ""

io.on("connection", socket => {
    socket.on('get-document', async documentId => {
        const document = await findOrCreateDocument(documentId)
        socket.join(documentId)
        const data = document.data? document.data: ''
        socket.emit('load-document', data)
        socket.on('send-changes', delta => {
            socket.broadcast.to(documentId).emit("receive-changes", delta)
        
        })
        //Saving the document
        socket.on("save-document", async data => {
            await Document.findByIdAndUpdate(documentId, {data})
        })
    })    
})


async function findOrCreateDocument(id) {
    if(id==null) return

    const document = await Document.findById(id)
    if(document) return document
    return await Document.create({_id: id, data: defaultValue}) 
}