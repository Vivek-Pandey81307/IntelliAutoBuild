'use client'
import { Connection } from '@/lib/types'
import { useNodeConnections } from '@/providers/connections-provider'
import { EditorState } from '@/providers/editor-provider'
import { ConnectOpts } from 'net'
import React from 'react'

type Props = {}

const RenderConnectionAccordion = ({ connection, state, }: {
    connection: Connection
    state: EditorState
}) => {
    const {
        title,
        image,
        description,
        connectionKey,
        accessTokenKey,
        alwaysTrue,
        slackSpecial,
    
    } = connection
    const {nodeConnection} = useNodeConnections()
    return (
        <div>RenderConnectionAccordion</div>
    )
}

export default RenderConnectionAccordion