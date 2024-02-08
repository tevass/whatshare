import { Metadata } from 'next'

import { SignInForm } from './components/sign-in-form'

export const metadata: Metadata = {
  title: 'Entrar',
}

export default function SignIn() {
  return (
    <main className="relative flex items-center justify-center w-full h-full">
      <div className="bg-primary w-full h-[45vh] absolute inset-0 -z-[1]" />

      <div className="flex items-center justify-center">
        <SignInForm />
      </div>
    </main>
  )
}
