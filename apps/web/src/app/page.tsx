import { Metadata } from 'next'
import { SignInForm } from './components/sign-in-form'

export const metadata: Metadata = {
  title: 'Entrar',
}

export default function SignIn() {
  return (
    <main className="flex items-center justify-center h-full">
      <SignInForm />
    </main>
  )
}
