import { Aside } from '@/components/ui/aside'
import { Text } from '@/components/ui/typography/text'
import { SquarePen, User } from 'lucide-react'

import { Chat } from './chat'
import { Scroll } from '@/components/ui/scroll'
import { Header } from '@/components/ui/header'
import { Heading } from '@/components/ui/typography/heading'
import { IconButton } from '@/components/ui/icon-button'

export function Sidebar() {
  return (
    <Aside>
      <Header className="px-5 pt-4 space-y-3 pb-2">
        <div className="flex items-center justify-between">
          <Heading.H3>Conversas</Heading.H3>

          <IconButton variant="ghost">
            <SquarePen className="w-4 h-4" />
          </IconButton>
        </div>
      </Header>

      <Scroll className="h-[calc(100lvh_-_theme(spacing.16)))]">
        <section className="px-2.5 pb-2 pt-1 space-y-1.5">
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
