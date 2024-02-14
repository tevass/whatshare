import { User } from 'lucide-react'

import { Aside } from '@/components/ui/aside'
import { ScrollArea } from '@/components/ui/scroll-area'

import { Chat } from '../chat'
import { SidebarHeader } from './header'

export function Sidebar() {
  return (
    <Aside>
      <SidebarHeader />

      <ScrollArea className="h-[calc(100lvh_-_120px)]">
        <div className="p-6 pt-1 pb-2 space-y-1">
          {Array.from(Array(20)).map((_, i) => (
            <Chat.Root href={`/wa/${i}`} key={i} scroll={false}>
              <Chat.Avatar>
                {/* <Chat.AvatarImage src="https://github.com/tevass.png" /> */}
                <Chat.AvatarFallback>
                  <Chat.AvatarFallbackIcon>
                    <User />
                  </Chat.AvatarFallbackIcon>
                </Chat.AvatarFallback>
              </Chat.Avatar>

              <Chat.Content>
                <Chat.Header>
                  <Chat.Name>GoM - Gang of Macacos</Chat.Name>
                  <Chat.Time variant="highlight">20:09</Chat.Time>
                </Chat.Header>

                <Chat.Footer>
                  <p className="leading-none font-medium text-sm flex-1 text-muted-foreground truncate py-0.5">
                    Message
                  </p>
                  <Chat.MessagesCounter>3</Chat.MessagesCounter>
                </Chat.Footer>
              </Chat.Content>
            </Chat.Root>
          ))}
        </div>
      </ScrollArea>
    </Aside>
  )
}
