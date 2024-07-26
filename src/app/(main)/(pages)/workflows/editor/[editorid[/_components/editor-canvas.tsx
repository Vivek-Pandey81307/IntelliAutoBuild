'use client'
import React, { useCallback, useMemo, useState } from 'react'
import { ReactFlow, ReactFlowInstance } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { EditorCanvasCardType, EditorNodeType } from '@/lib/types';
import { useEditor } from '@/providers/editor-provider';
import EditorCanvasCardSingle from './editor-canvas-card-single';
import {
    ResizableHandle,
    ResizablePanel,
    ResizablePanelGroup,
  } from "@/components/ui/resizable"
import { EditorCanvasDefaultCardTypes } from '@/lib/constant';
import { toast } from 'sonner';
import { usePathname } from 'next/navigation';
import {v4} from 'uuid'
type Props = {}

const initialNodes : EditorNodeType[] = []
const initialEdges : {id : string ;source : string; target : string}[]=[]
const EditorCanvas = (props: Props) => {
    const {dispatch,state}  = useEditor()
    const [nodes, setNodes] = useState(initialNodes)
    const [reactFlowInstance,setReactFlowInstance] = useState<ReactFlowInstance>()
    const pathname = usePathname();

    

    const onDrop= useCallback(
        (event : any) =>{
            event.preventDefault()
            const type : EditorCanvasCardType['type']  = event.dataTransfer.getData('application/reactflow')
            if(typeof type === 'undefined' || !type){return}
            const triggerAlreadyExists = state.editor.elements.find(
                (node) =>node.type === 'Trigger'
            )
            if(type === 'Trigger' && triggerAlreadyExists){
                toast('Only one trigger can be added to automations at the moment')
                return
            }
            if(!reactFlowInstance) return 
            const position = reactFlowInstance.screenToFlowPosition({
                x : event.clientX,
                y : event.clientY,
            })
            const newNode = {
                id : v4(),
                type ,
                position,
                data : {
                    title : type,
                    description : EditorCanvasDefaultCardTypes[type].description,
                    completed : false,
                    current : false,
                    metadata : {},
                    type : type,
                }
            }
            setNodes((nds)=>nds.concat(newNode))
        },
        [reactFlowInstance,state]
        }
    )

    const nodeTypes = useMemo(
        () =>({
            Action :  EditorCanvasCardSingle,
            Trigger : EditorCanvasCardSingle,
            Email : EditorCanvasCardSingle,
            Condition : EditorCanvasCardSingle,
            AI : EditorCanvasCardSingle,
            Slack : EditorCanvasCardSingle,
            'Google Drive': EditorCanvasCardSingle,
            Notion : EditorCanvasCardSingle,
            Discord : EditorCanvasCardSingle,
            'Custom Webhook' : EditorCanvasCardSingle,
            'Google Calendar' : EditorCanvasCardSingle,
            wait : EditorCanvasCardSingle,
        }),[]
    )
    return (
        <ResizablePanelGroup
         direction="horizontal"
         className=""
        >
            <ResizablePanel defaultSize={70} >
                <div className='flex h-full items-center justify-center'>
                    <div
                    style={{width : '100%',height : '100%',paddingBottom : '70px'}}
                    className='relative'>
                        <ReactFlow 
                        className='w-[300px]'
                        onDrop={onDrop}
                        onDragOver={onDragOver}
                        nodes={state.editor.elements}
                        edges={edges}
                        onEdgesChange={onEdgesChange}
                        onConnect={onConnect}
                        onInit={setReactFlowInstance}
                        fitView
                        onClick={handleClickCanvas}
                        nodeTypes={nodeTypes}></ReactFlow>
                    </div>
                </div>
            </ResizablePanel>
        </ResizablePanelGroup>
    )
}

export default EditorCanvas