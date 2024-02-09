import { Aside } from '@/components/ui/aside'
import { Text } from '@/components/ui/typography/text'
import { User } from 'lucide-react'

import { Chat } from './chat'
import { Scroll } from '@/components/ui/scroll'
import { Header } from '@/components/ui/header'
import { Heading } from '@/components/ui/typography/heading'

export function Sidebar() {
  return (
    <Aside>
      <Header className="p-3 pb-2 space-y-2">
        <Heading.H3>Conversas</Heading.H3>

        <section>
          <div className="h-9 border rounded-md" />
        </section>
      </Header>

      <Scroll className="h-[calc(100lvh_-_20px)]">
        <section className="px-3 pb-2 pt-1 space-y-1.5">
          {Array.from(Array(15)).map((_, i) => (
            <Chat.Root href={`/wa/${i}`} key={i}>
              <Chat.Avatar>
                <Chat.AvatarImage src="https://github.com/tevass.png" />
                <Chat.AvatarFallback>
                  <User className="w-6 h-6" />
                </Chat.AvatarFallback>
              </Chat.Avatar>

              <Chat.Content>
                <Chat.Header>
                  <Chat.Name>GoM - Gang of Macacos</Chat.Name>

                  <Chat.Time>16:00</Chat.Time>
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
      </Scroll>
    </Aside>
  )
}
