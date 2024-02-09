import { Aside } from '@/components/ui/aside'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Text } from '@/components/ui/typography/text'
import { User } from 'lucide-react'
import { Chat } from './chat'

export function Sidebar() {
  return (
    <Aside>
      <ScrollArea className="h-lvh">
        <section className="px-2 py-2 space-y-1.5">
          {Array.from(Array(15)).map((_, i) => (
            <Chat.Root
              className="relative"
              key={i}
              variant={i % 2 ? 'active' : 'inactive'}
            >
              <Chat.AvatarWrapper>
                <Chat.Avatar>
                  <Chat.AvatarImage src="https://github.com/tevass.png" />
                  <Chat.AvatarFallback>
                    <User className="w-6 h-6" />
                  </Chat.AvatarFallback>
                </Chat.Avatar>

                <Chat.GroupIndicator>GRUPO</Chat.GroupIndicator>
              </Chat.AvatarWrapper>

              <Chat.Content>
                <Chat.Header>
                  <Chat.Name>GoM - Gang of Macacos</Chat.Name>

                  <Chat.Time variant="highlight">16:00</Chat.Time>
                </Chat.Header>

                <Chat.Footer>
                  <Text className="leading-none font-medium text-sm flex-1 text-muted-foreground truncate py-0.5">
                    Message
                  </Text>

                  <Chat.MessagesCounter>1</Chat.MessagesCounter>
                </Chat.Footer>
              </Chat.Content>
            </Chat.Root>
          ))}
        </section>
      </ScrollArea>
    </Aside>
  )
}
