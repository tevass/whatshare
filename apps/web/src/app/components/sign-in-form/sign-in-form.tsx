'use client'

import { useZodForm } from '@/hooks/use-zod-form'

import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { Form } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { InputGroup } from '@/components/ui/input-group'
import { Mail } from 'lucide-react'
import { InputPassword } from './input-password'
import { SignInFormSchemaOutput, signInFormSchema } from './schema'

export function SignInForm() {
  const formProps = useZodForm({
    schema: signInFormSchema,
    defaultValues: {
      email: '',
      password: '',
      rememberMe: false,
    },
  })

  const { control, handleSubmit } = formProps

  function handleSignIn(data: SignInFormSchemaOutput) {
    console.log(data)
  }

  return (
    <Form.Root {...formProps}>
      <Form.Content onSubmit={handleSubmit(handleSignIn)}>
        <Card.Root className="w-[310px] sm:w-96">
          <Card.Content className="pt-5 pb-3.5 space-y-3">
            <Form.Field
              control={control}
              name="email"
              render={({ field }) => (
                <Form.Item>
                  <Form.Label>E-mail</Form.Label>

                  <InputGroup.Root>
                    <InputGroup.LeftElement>
                      <Mail className="size-4" />
                    </InputGroup.LeftElement>

                    <Form.Control>
                      <Input type="email" className="ps-9" {...field} />
                    </Form.Control>
                  </InputGroup.Root>

                  <Form.Message />
                </Form.Item>
              )}
            />

            <Form.Field
              control={control}
              name="password"
              render={({ field }) => (
                <Form.Item>
                  <Form.Label>Senha</Form.Label>

                  <Form.Control>
                    <InputPassword type="password" {...field} />
                  </Form.Control>

                  <Form.Message />
                </Form.Item>
              )}
            />

            <Form.Field
              control={control}
              name="rememberMe"
              render={({ field }) => (
                <Form.Item orientation="horizontal">
                  <Form.Control>
                    <Checkbox {...field} />
                  </Form.Control>

                  <Form.Label>Lembrar de mim?</Form.Label>
                </Form.Item>
              )}
            />
          </Card.Content>

          <Card.Footer>
            <Button type="submit">ENTRAR</Button>
          </Card.Footer>
        </Card.Root>
      </Form.Content>
    </Form.Root>
  )
}
