import EditorProvider from '@/providers/editor-provider'
import React from 'react'

type Props = {}

const Page = (props: Props) => {
  return (
    <div className='h-full'>
        <EditorProvider>
          <ConnectionProvider></ConnectionProvider>
        </EditorProvider>
    </div>
  )
}

export default Page