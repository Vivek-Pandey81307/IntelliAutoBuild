import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ConnectionTypes } from '@/lib/types'
import Image from 'next/image';
import React from 'react'

type Props = {
    type : ConnectionTypes
    icon : string;
    title : ConnectionTypes;
    description : string;
    callback ? :()=>void;
    connected : {} & any;
}

const ConnectionCard = ({description,type,icon,title,connected}: Props) => {
  return (
  <Card className = "flex w-full items-center justify-between" >
    <CardHeader className = 'flex flex-col gap-4' >
        <div className='flex flex-row gap-2'>
            <Image
            src = {icon}
            alt = {title}
            height = {30}
            width = {30}
            className="object-contain"/>
        </div>
        <CardTitle className='text-lg'>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
    </CardHeader>
  </Card>)
}

export default ConnectionCard