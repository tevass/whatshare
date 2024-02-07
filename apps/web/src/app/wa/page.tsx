import { Heading } from '@/components/ui/typography/heading'
import { Text } from '@/components/ui/typography/text'
import { Metadata } from 'next'
import { WhatsAppDevice } from './components/whats-app-device/root'

export const metadata: Metadata = {
  title: 'Selecione um WhatsApp',
}

export default function WAPage() {
  return (
    <main className="flex h-full">
      <div className="mx-auto min-w-[310px] max-w-2xl w-full mt-[8vh] space-y-10 p-4">
        <header className="flex flex-col items-center space-y-1">
          <Heading.H2>Bem vindo, Estevão!</Heading.H2>
          <Text className="font-medium text-muted-foreground">
            Selecione o <span className="text-primary">WhatsApp</span> que
            deseja utilizar inicialmente
          </Text>
        </header>

        <section className="grid grid-cols-2 gap-x-3 gap-y-3">
          <WhatsAppDevice />
        </section>
      </div>
    </main>
  )
}
