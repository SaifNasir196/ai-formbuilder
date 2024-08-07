import React from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import { ParsedFormSubmission } from "@/lib/type"

interface ResponseDetailsModalProps {
  isOpen: boolean
  onClose: () => void
  response: Partial<ParsedFormSubmission>
}

const ResponseDetailsModal: React.FC<ResponseDetailsModalProps> = ({ isOpen, onClose, response }) => {
  if (!response) return null

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Response Details</DialogTitle>
          <DialogDescription>
            Full details of the selected form response.
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="mt-8 max-h-[60vh] pr-4">
          {Object.entries(response).map(([key, value]) => (
            <div key={key} className="mb-4">
              <h4 className="text-sm font-medium leading-none mb-1">{key}</h4>
              <p className="text-sm text-muted-foreground break-words">
                {typeof value === 'object' ? JSON.stringify(value, null, 2) : String(value)}
              </p>
            </div>
          ))}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
}

export default ResponseDetailsModal