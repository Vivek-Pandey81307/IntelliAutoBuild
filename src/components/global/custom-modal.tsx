import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer"

import { useModal } from '@/providers/modal-provider'
import React from 'react'
import { Button } from "../ui/button"

type Props = {
  title: string
  subheading: string
  children: React.ReactNode
  defualtOpen?: boolean
}

const CustomModal = ({ children, subheading, title, defualtOpen }: Props) => {
  const { isOpen, setClose } = useModal()
  const handleClose = () => setClose()
  return (
    <Drawer open={isOpen} onClose={handleClose}>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle className="text-center">{title}</DrawerTitle>
          <DrawerDescription className="text-center flex flex-col items-center gap-4 h-96 
          overflow-scroll">{subheading}
            {children}</DrawerDescription>
        </DrawerHeader>
        <DrawerFooter className="flex flex-col gap-4 bg-background border-t-[1px] border-t-muted"></DrawerFooter>
        <DrawerClose><Button variant="ghost" className="w-full" onClick={handleClose}>Close</Button></DrawerClose>
      </DrawerContent>
    </Drawer>
  )
}

export default CustomModal