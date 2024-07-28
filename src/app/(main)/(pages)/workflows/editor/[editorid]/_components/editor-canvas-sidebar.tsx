'use client'
import { EditorNodeType } from '@/lib/types'
import { useEditor } from '@/providers/editor-provider'
import React from 'react'

type Props = {
    nodes : EditorNodeType[]
}

const EditorCanvasSidebar = ({nodes}: Props) => {
    const {state}  = useEditor();
  return (
    <div>EditorCanvasSidebar</div>
  )
}

export default EditorCanvasSidebar