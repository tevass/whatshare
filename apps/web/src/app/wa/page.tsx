import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { CardContent } from '@/components/ui/card/content'
import { Select } from '@/components/ui/select'

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
          <Select.Root>
            <Select.Trigger>
              <Select.Value placeholder="Selecione..." />
            </Select.Trigger>

            <Select.Content>
              <Select.Item value="1">WhatsApp 1</Select.Item>
            </Select.Content>
          </Select.Root>
        </CardContent>

        <Card.Footer>
          <Button>CONTINUAR</Button>
        </Card.Footer>
      </Card.Root>
    </section>
  )
}