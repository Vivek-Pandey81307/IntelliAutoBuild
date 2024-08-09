import { ConnectionProviderProps } from '@/providers/connections-provider'
import { Option } from '@/store'
import React from 'react'

type Props = {
    currentService : string
    nodeConnection : ConnectionProviderProps
    channels?:Option[]
    setChannels?:(value: Option[]) =>void
}

const ActionButton = ({currentService,nodeConnection,channels,setChannels}: Props) => {
  return (
    <div>ActionButton</div>
  )
}

export default ActionButton