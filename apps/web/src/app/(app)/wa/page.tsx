import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Avatar } from '@/components/ui/avatar'
import { Text } from '@/components/ui/typography/text'
import Link from 'next/link'

export default function Page() {
  return (
    <div className="flex items-center justify-center h-full bg-muted">
      <Card className="px-8 py-4 shadow-sm">
        <Card.Header className="text-center space-y-3">
          <Card.Title>Bem vindo Estevão!</Card.Title>

          <Card.Description>
            Selecione o{' '}
            <span className="text-primary font-medium">WhatsApp</span> que
            deseja utilizar inicialmente.
            <br /> Não se preocupe você irá conseguir mudar depois.
          </Card.Description>
        </Card.Header>

        <Card.Content className="grid grid-cols-2 gap-2">
          {Array.from(Array(10)).map((_, i) => (
            <Button
              asChild
              variant="outline"
              className="space-x-3 justify-start"
              key={i}
            >
              <Link href="/wa">
                <Avatar size="xs">
                  <Avatar.Fallback size="xs" className="bg-primary/10">
                    W
                  </Avatar.Fallback>
                </Avatar>
                <Text asChild>
                  <span>WhatsApp</span>
                </Text>
              </Link>
            </Button>
          ))}
        </Card.Content>
      </Card>
    </div>
  )
}
