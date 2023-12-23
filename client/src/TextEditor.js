import { useCallback, useEffect, useState } from 'react'
import Quill from "quill"
import "quill/dist/quill.snow.css"
import {io} from 'socket.io-client'

const TOOLBAR_OPTIONS = [
    [{ header: [1, 2, 3, 4, 5, 6, false] }],
    [{ font: [] }],
    [{ list: "ordered" }, { list: "bullet" }],
    ["bold", "italic", "underline"],
    [{ color: [] }, { background: [] }],
    [{ script: "sub" }, { script: "super" }],
    [{ align: [] }],
    ["image", "blockquote", "code-block"],
    ["clean"],
  ]


export default function TextEditor() {
    const[socket, setSocket]= useState()
    const [quill, setQuill] = useState()
    // const wrapperRef = useRef()
    useEffect(()=>{
        const s = io("http://localhost:3001")
        setSocket(s)
        return() => {
            s.disconnect()
        }
    },[])

    useEffect(()=>{
        //Update the document with changes(delta) from our other client
        if (socket == null || quill == null) return  // Initially quill and socket are going to be null hence we don't want to do anything unless until the connection is setup.
        const handler = (delta) => {
            quill.updateContents(delta)
        }
        socket.on('receive-changes', handler)

        return() => {
            socket.off('receive-changes', handler)
        }
    }, [socket,quill])

    useEffect(()=>{
        if (socket == null || quill == null) return  // Initially quill and socket are going to be null hence we don't want to do anything unless until the connection is setup.
        const handler = (delta, oldDelta, source) => {
            if (source !== 'user') return //only track changes if user made them
            socket.emit("send-changes", delta) // delta is not the whole document. It is only a subset of the document that is changing.
        }
        quill.on('text-change', handler)

        return() => {
            quill.off('text-changes', handler)
        }
    }, [socket,quill])

    const wrapperRef= useCallback((wrapper)=>{
        if (wrapper == null) return

        wrapper.innerHTML = ""
        const editor = document.createElement("div")
        wrapper.append(editor)
        const q = new Quill(editor, {theme: "snow", modules: {toolbar: TOOLBAR_OPTIONS} })
        setQuill(q)

    }, [])
    return <div className="container" ref={wrapperRef}></div>
}
