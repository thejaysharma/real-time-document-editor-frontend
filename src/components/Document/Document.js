import "./Document.css"
import {useEffect, useCallback, useState} from "react"
import Quill from "quill"
import "quill/dist/quill.snow.css"

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

  const wrapperRef = useCallback((wrapper)=>{
    if (wrapper == null) return

    wrapper.innerHTML = ""
    const editor = document.createElement('div')
    wrapper.append(editor)
    new Quill(editor, {
      theme: "snow",
      modules: {
        toolbar: OPTIONS
      }
    })
    return () => {
      wrapperRef.innerHTML = ""
    }
  }, [])
  useEffect(()=>{
    const socket = io("http://localhost:3001")
  })
  return (
    <div>
      <div id="header">
        <div id="title">Untitled Document</div>
        <div id="share">
          <button onClick={() => shareDocument()}>Share</button>
        </div>
      </div>
      <div id="container" ref={wrapperRef}></div>
    </div>
  )

}

export default DocumentEditor;

