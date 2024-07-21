'use client'

import { EditorActions, EditorNodeType } from '@/lib/types';
import {
    Dispatch,
    createContext,
    useContext,
    useEffect,
    useReducer
} from 'react'

export type EditorNode = EditorNodeType;

export type Editor = {
    elements: EditorNode[];
    edges: {
        id: string;
        source: string;
        target: string;
    }[];
    selectedNode: EditorNodeType;
}

export type HistoryState = {
    history: Editor[]
    currentIndex: number
}
export type EditorState = {
    editor: Editor
    history: HistoryState
}
const initialEditorState: EditorState['editor'] = {
    elements: [],
    selectedNode: {
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
        type: 'Trigger'

    },
    edges: [],
}
const initialHistoryState: HistoryState = {
    history: [initialEditorState],
    currentIndex: 0,
}
const initialState: EditorState = {
    editor: initialEditorState,
    history: initialHistoryState,
}
const editorReducer = (state: EditorState = initialState, action: EditorActions): EditorState => {
    switch (action.type) {

        case 'REDO':
            if (state.history.currentIndex < state.history.history.length - 1) {
                const nextIndex = state.history.currentIndex + 1
                const nextEditorState = { ...state.history.history[nextIndex] }
                const redoState = {
                    ...state,
                    editor: nextEditorState,
                    history: {
                        ...state.history,
                        currentIndex: nextIndex,
                    },
                }
                return redoState
            }
            return state

        
        case 'UNDO' : 
            if (state.history.currentIndex > 0){
                const prevIndex  = state.history.currentIndex -1 ;
                const prevEditorState = {...state.history.history[prevIndex]}
                const undoState = {
                    ...state ,
                    editor : prevEditorState,
                    history : {
                        ...state.history,
                        currentIndex : prevIndex,
                    }
                }
            }
        
        case 'LOAD_DATA':
            return {
                ...state,
                editor : {
                    ...state.editor,
                    elements  : action.payload.elements || initialEditorState.elements,
                    edges : action.payload.edges,
                }
            }
        default:
            return state;
    }
}