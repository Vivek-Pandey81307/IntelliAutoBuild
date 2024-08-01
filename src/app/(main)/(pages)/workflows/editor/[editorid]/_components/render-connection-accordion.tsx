'use client'
import ConnectionCard from '@/app/(main)/(pages)/connections/_components/connection-card'
import { Connection } from '@/lib/types'
import { useNodeConnections } from '@/providers/connections-provider'
import { EditorState } from '@/providers/editor-provider'
import { useFuzzieStore } from '@/store'
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
    const {slackChannels,selectedSlackChannels,setSelectedSlackChannels} =useFuzzieStore()
    const connectionData = (nodeConnection as any )[connectionKey]
    const isConnected = 
    alwaysTrue || 
    (nodeConnection[connectionKey]  && 
    accessTokenKey && 
    connectionData[accessTokenKey!])
    return 
     <ConnectionCard 
     title={title}
     icon={image}
     description={description}
     type={title}
     connected={{[title]:isConnected}}/>
}

export default RenderConnectionAccordion