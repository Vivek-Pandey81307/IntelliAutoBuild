'use client'
import React, { useCallback, useMemo, useState } from 'react'
import { applyEdgeChanges, applyNodeChanges, NodeChange, ReactFlow, ReactFlowInstance, EdgeChange, Edge, Connection, addEdge, Controls, MiniMap } from '@xyflow/react';
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
import { v4 } from 'uuid'
type Props = {}

const initialNodes: EditorNodeType[] = []
const initialEdges: { id: string; source: string; target: string }[] = []
const EditorCanvas = (props: Props) => {
    const { dispatch, state } = useEditor()
    const [nodes, setNodes] = useState(initialNodes)
    const [edges, setEdges] = useState(initialEdges)
    const [isWorkFlowLoading, setIsWorkFlowLoading] = useState<boolean>(false)
    const [reactFlowInstance, setReactFlowInstance] = useState<ReactFlowInstance>()
    const pathname = usePathname();


    const onConnect = useCallback(
        (params: Edge | Connection) => setEdges((eds) => addEdge(params, eds)), []
    )
    const onEdgesChange = useCallback((changes: EdgeChange[]) =>
        setEdges((eds) => applyEdgeChanges(changes, eds)), [setEdges]
    )
    const onNodeChange = useCallback(
        (changes: NodeChange[]) => {
            //@ts-ignore
            setNodes((nds) => applyNodeChanges(changes, nds))
        }, [setNodes])

    const onDragOver = useCallback((event: any) => {
        event.preventDefault()
        event.dataTransfer.dropEffect = 'save'
    }, [])

    const handleClickCanvas = () => {
        dispatch({
            type: 'SELECTED_ELEMENT',
            payload: {
                element: {
                    data: {
                        completed: false,
                        current: false,
                        description: '',
                        metadata: {},
                        title: '',
                        type: 'Trigger',
                    },
                    id: '',
                    position: { x: 0, y: 0 },
                    type: 'Trigger',
                }
            }
        })
    }
    const onDrop = useCallback(
        (event: any) => {
            event.preventDefault()
            const type: EditorCanvasCardType['type'] = event.dataTransfer.getData('application/reactflow')
            if (typeof type === 'undefined' || !type) { return }
            const triggerAlreadyExists = state.editor.elements.find(
                (node) => node.type === 'Trigger'
            )
            if (type === 'Trigger' && triggerAlreadyExists) {
                toast('Only one trigger can be added to automations at the moment')
                return
            }
            if (!reactFlowInstance) return
            const position = reactFlowInstance.screenToFlowPosition({
                x: event.clientX,
                y: event.clientY,
            })
            const newNode = {
                
                id: v4(),
                type,
                position,
                data: {
                    title: type,
                    //@ts-ignore
                    description: EditorCanvasDefaultCardTypes[type].description,
                    completed: false,
                    current: false,
                    metadata: {},
                    type: type,
                }
            }
            setNodes((nds) => nds.concat(newNode))
        },
        [reactFlowInstance, state]
        
    )

const nodeTypes = useMemo(
    () => ({
        Action: EditorCanvasCardSingle,
        Trigger: EditorCanvasCardSingle,
        Email: EditorCanvasCardSingle,
        Condition: EditorCanvasCardSingle,
        AI: EditorCanvasCardSingle,
        Slack: EditorCanvasCardSingle,
        'Google Drive': EditorCanvasCardSingle,
        Notion: EditorCanvasCardSingle,
        Discord: EditorCanvasCardSingle,
        'Custom Webhook': EditorCanvasCardSingle,
        'Google Calendar': EditorCanvasCardSingle,
        wait: EditorCanvasCardSingle,
    }), []
)
return (
    <ResizablePanelGroup
        direction="horizontal"
        className=""
    >
        <ResizablePanel defaultSize={70} >
            <div className='flex h-full items-center justify-center'>
                <div
                    style={{ width: '100%', height: '100%', paddingBottom: '70px' }}
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
                        nodeTypes={nodeTypes}>
                        <Controls position="top-left" />
                        <MiniMap
                            position="bottom-left"
                            className="!bg-background"
                            zoomable
                            pannable
                        />
                    </ReactFlow>
                </div>
            </div>
        </ResizablePanel>
    </ResizablePanelGroup>
)
}

export default EditorCanvas