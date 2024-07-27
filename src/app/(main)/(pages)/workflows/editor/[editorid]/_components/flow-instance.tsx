import { useNodeConnections } from '@/providers/connections-provider'
import { usePathname } from 'next/navigation'
import React, { useState } from 'react'

type Props = {
    children : React.ReactNode
    edges : any[]
    nodes : any[]
}

const FlowInstance = ({children,edges,nodes}: Props) => {
    const pathname = usePathname()
    const [isFlow,setIsFlow] = useState([])
    const {nodeConnection} = useNodeConnections()
    return (
    <div className='flex flex-col gap-2'>
        <div className='flex gap-3 p-4'> 
            <Button onClick={onFlowAutomation} disabled={isFlow.length <1}>Save</Button>
        </div>
    </div>
  )
}

export default FlowInstance