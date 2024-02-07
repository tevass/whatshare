import { z } from 'zod'

export const signInFormSchema = z.object({
  email: z.string().email('E-mail inválido'),
  password: z.string().refine((value) => !!value.trim(), {
    message: 'Preencha o campo',
  }),
})

export type SignInFormInput = z.input<typeof signInFormSchema>
export type SignInFormOutput = z.output<typeof signInFormSchema>
