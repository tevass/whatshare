import Image from 'next/image'

export default function Page() {
  return (
    <div className="flex h-full items-center justify-center">
      <div className="text-center space-y-2.5">
        <Image
          src="/logo.svg"
          alt="WhatShare"
          width={72}
          height={72}
          className="size-16 mx-auto"
        />

        <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">
          WhatShare
        </h3>

        <p className="leading-5 text-sm font-medium text-muted-foreground">
          Envie e receba mensagens do WhatsApp de forma simplificada. <br />
          Selecione uma das conversas ao lado para começar a trocar mensagens.
        </p>
      </div>
    </div>
  )
}
