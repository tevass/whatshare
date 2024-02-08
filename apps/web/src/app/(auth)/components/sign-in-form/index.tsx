'use client'

import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Form } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { useZodForm } from '@/hooks/use-zod-form'
import { SignInFormOutput, signInFormSchema } from './schema'

import { Mail } from 'lucide-react'
import { InputPassword } from './input-password'

export function SignInForm() {
  const formProps = useZodForm({
    schema: signInFormSchema,
    defaultValues: {
      email: '',
      password: '',
    },
  })

  const { control, handleSubmit } = formProps

  function handleSignIn(data: SignInFormOutput) {
    console.log(data)
  }

  return (
    <form
      className="w-[310px] sm:w-96 p-2"
      onSubmit={handleSubmit(handleSignIn)}
    >
      <Form {...formProps}>
        <Card className="pt-4 shadow-md">
          <Card.Content className="pb-3 space-y-2">
            <Form.Field
              control={control}
              name="email"
              render={({ field }) => (
                <Form.Item>
                  <Form.Label>E-mail</Form.Label>

                  <Input.Group>
                    <Input.LeftElement>
                      <Mail className="w-4 h-4" />
                    </Input.LeftElement>

                    <Form.Control>
                      <Input type="email" className="ps-9" {...field} />
                    </Form.Control>
                  </Input.Group>

                  <Form.ErrorMessage />
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
                    <InputPassword {...field} />
                  </Form.Control>

                  <Form.ErrorMessage />
                </Form.Item>
              )}
            />
          </Card.Content>

          <Card.Footer>
            <Button type="submit" full>
              ENTRAR
            </Button>
          </Card.Footer>
        </Card>
      </Form>
    </form>
  )
}
