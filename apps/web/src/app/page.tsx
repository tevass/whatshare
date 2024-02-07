import { Metadata } from 'next'
import { SignInForm } from './components/sign-in-form'

export const metadata: Metadata = {
  title: 'Entrar',
}

export default function SignIn() {
  return (
    <main className="w-full h-full">
      <div className="bg-primary w-full h-[50vh]" />

      <div className="flex items-center justify-center -mt-[10vh]">
        <SignInForm />
      </div>
    </main>
  )
}
