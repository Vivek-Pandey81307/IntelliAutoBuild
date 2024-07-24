import { EditorCanvasCardType } from '@/lib/types'
import { useEditor } from '@/providers/editor-provider'
import { Position, useNodeId } from '@xyflow/react'
import React, { useMemo } from 'react'
import EditorCanvasIconHelper from './editor-canvas-icon-helper'
import CustomHandle from './custom-handle'
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

type Props = {}

const EditorCanvasCardSingle = ({data} : {data : EditorCanvasCardType} )=> {
   const {dispatch,state} = useEditor()
   const nodeId = useNodeId()
   const logo = useMemo(()=>{
    return <EditorCanvasIconHelper type={data.type} />
   },[data])
    return (
        <>
        {data.type !=='Trigger' && data.type !=='Google Drive' && (
            <CustomHandle
            type='target'
            position={Position.Top}
            style = {{zIndex : 100}}/>
        )}
       <Card 
       onClick= {(e)=>{
        e.stopPropagation()
        const val = state.editor.elements.find((n)=>n.id ===nodeId)
        if(val)
            dispatch({
        type : 'SELECTED_ELEMENT',
    payload : {
        element : val,
    }})
       }}
       className='relative max-w-[400px] dark:border-muted-foreground/70'
       >
        <CardHeader className='flex flex-row items-center gap-4'>
            <div>{logo}</div>
            <div>
                <CardTitle className='text-md'>{data.title}</CardTitle>
                <CardDescription>
                    <p  className='text-xs text-muted-foreground/58'>
                    <b className='text-muted-foreground/80'>ID:</b>{nodeId}</p>
                    <p>{data.description}</p>
                </CardDescription>
            </div>
        </CardHeader>
       </Card>
       </>
  )
}

export default EditorCanvasCardSingle