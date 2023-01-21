import "./Document.css"
import {useEffect, useCallback, useState} from "react"
import Quill from "quill"
import { io } from "socket.io-client"
import "quill/dist/quill.snow.css"
import { useParams } from "react-router-dom"

const OPTIONS = [
  [{ header: [1, 2, 3, 4, 5, 6, false] }],
  [{ font: [] }],
  [{ list: "ordered" }, { list: "bullet" }],
  ["bold", "italic", "underline"],
  [{ color: [] }, { background: [] }],
  [{ script: "sub" }, { script: "super" }],
  [{ align: [] }],
  ["blockquote", "code-block"],
  ["clean"],
]

function DocumentEditor() {
  const [title, setTitle] = useState("Untitled Document");
  const [socket, setSocket] = useState();
  const [quill, setQuill] = useState();
  const {id : docID} = useParams();
  function shareDocument() {
    const link = document.location.href;
    navigator.clipboard.writeText(link)
      .then(() => {
        alert('Link copied to clipboard!')
      })
      .catch(err => {
        console.log('Failed to copy link: ', err)
      })
  }

  function handleTitleChange(newTitle) {
    setTitle(newTitle);
    socket.emit("update-title", {docID, newTitle});
  }

  const wrapperRef = useCallback((wrapper)=>{
    if (wrapper == null) return

    wrapper.innerHTML = ""
    const editor = document.createElement('div')
    wrapper.append(editor)
    const q = new Quill(editor, {
      theme: "snow",
      modules: {
        toolbar: OPTIONS
      }
    })
    q.disable()
    q.setText("Loading...")
    setQuill(q)
  }, [])

  useEffect(()=>{
    const s = io("http://localhost:5000")
    setSocket(s)
    return () => {
      s.disconnect()
    }
  }, [])

  useEffect(() => {
    if (socket == null) return
    socket.on("title-updated", title => setTitle(title));
  }, [socket]);

  useEffect(()=> {
    if (socket == null || quill == null) return

    socket.once("load-document", document => {
      quill.setContents(document)
      quill.enable()
    })

    socket.emit("get-document", docID)
  }, [socket, quill, docID])

  useEffect(() => {
    if (socket == null || quill == null) return

    const handler = delta => {
      quill.updateContents(delta)
    }
    socket.on("receive-changes", handler)

    return () => {
      socket.off("receive-changes", handler)
    }
  }, [socket, quill])

  useEffect(() => {
    if (socket == null || quill == null) return

    const handler = (delta, oldDelta, source) => {
      if (source !== "user") return
      socket.emit("send-changes", delta)
    }
    quill.on("text-change", handler)

    return () => {
      quill.off("text-change", handler)
    }
  }, [socket, quill])

  return (
    <div>
      <div id="header">
        <input type="text" value={title} onChange={e => handleTitleChange(e.target.value)} />
        <div id="share">
          <button onClick={() => shareDocument()}>Share</button>
        </div>
      </div>
      <div id="container" ref={wrapperRef}></div>
    </div>
  )

}

export default DocumentEditor;

