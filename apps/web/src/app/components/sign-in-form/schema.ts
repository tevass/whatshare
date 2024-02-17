import { z } from 'zod'

export const signInFormSchema = z.object({
  email: z.string().email('Insira um e-mail válido'),
  password: z.string().min(4, 'Insira uma senha'),
  rememberMe: z.boolean().default(false),
})

export type SignInFormSchemaInput = z.input<typeof signInFormSchema>
export type SignInFormSchemaOutput = z.output<typeof signInFormSchema>
