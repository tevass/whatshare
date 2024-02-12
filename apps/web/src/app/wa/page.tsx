import { Avatar } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { CardContent } from '@/components/ui/card/content'
import { Command } from '@/components/ui/command'
import { Popover } from '@/components/ui/popover'
import { ChevronsUpDown } from 'lucide-react'

export default function Page() {
  return (
    <section className="flex items-center justify-center h-full p-2">
      <Card.Root className="">
        <Card.Header className="pb-3">
          <Card.Title>Escolha um WhatsApp</Card.Title>
          <Card.Description>
            Selecione o{' '}
            <span className="font-medium text-primary">dispositivo</span>
            que deseja utilizar inicialmente.
          </Card.Description>
        </Card.Header>

        <CardContent className="flex justify-center pb-3">
          <Popover.Root>
            <Popover.Trigger asChild>
              <Button variant="outline" className="flex items-center">
                <div className="flex flex-1 items-center space-x-2">
                  <Avatar.Root size="xs">
                    {/* <Avatar.Image src="https://avatar.vercel.sh/personal.png" /> */}
                    <Avatar.Fallback size="xs" className="bg-primary/10">
                      W
                    </Avatar.Fallback>
                  </Avatar.Root>

                  <h4>WhatsApp</h4>
                </div>

                <ChevronsUpDown className="size-4 shrink-0 opacity-50" />
              </Button>
            </Popover.Trigger>

            <Popover.Content className="p-0 w-popover-trigger">
              <Command.Root>
                <Command.Group>
                  <Command.Item>asdasdasd</Command.Item>
                </Command.Group>
              </Command.Root>
            </Popover.Content>
          </Popover.Root>
        </CardContent>

        <Card.Footer>
          <Button>CONTINUAR</Button>
        </Card.Footer>
      </Card.Root>
    </section>
  )
}
