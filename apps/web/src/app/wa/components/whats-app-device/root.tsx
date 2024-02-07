import { Avatar } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Heading } from '@/components/ui/typography/heading'
import { ChevronRight } from 'lucide-react'

export function WhatsAppDevice() {
  return (
    <Button
      variant="outline"
      className="justify-between p-4 h-max hover:bg-initial hover:border-primary group"
    >
      <div className="flex items-center space-x-2">
        <Avatar className="w-14 h-14">
          <Avatar.Fallback>WP</Avatar.Fallback>
        </Avatar>

        <div className="flex flex-col items-start">
          <Heading.H4 className="text-lg">WhatsApp 1</Heading.H4>
          <Badge variant="primary" className="hover:bg-initial">
            ATIVO
          </Badge>
        </div>
      </div>

      <ChevronRight className="w-6 h-6 transition-colors text-border group-focus-within:text-primary group-hover:text-primary" />
    </Button>
  )
}
