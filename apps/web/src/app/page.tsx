import Image from 'next/image'

import { SignInForm } from './components/sign-in-form'

export default function Authenticate() {
  return (
    <section className="flex flex-col items-center justify-center h-full space-y-5">
      <header className="space-y-3">
        <Image
          src="/logo.svg"
          alt="WhatShare"
          width={72}
          height={72}
          className="mx-auto size-16"
        />

        <h3 className="text-2xl font-semibold tracking-tight scroll-m-20">
          WhatShare
        </h3>
      </header>

      <SignInForm />
    </section>
  )
}
