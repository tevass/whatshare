'use client'

import { Aside } from '@/components/ui/aside'
import { Avatar } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Command } from '@/components/ui/command'
import { Popover } from '@/components/ui/popover'
import { Heading } from '@/components/ui/typography/heading'
import { ChevronsUpDown } from 'lucide-react'

export function Sidebar() {
  return (
    <Aside className="px-3 border-r">
      <header className="py-3">
        <div className="flex items-center space-x-3">
          <Avatar>
            <Avatar.Image src="https://github.com/tevass.png" />
          </Avatar>

          <Heading.H4>Conversas</Heading.H4>
        </div>

        <div className="mt-3">
          <Popover>
            <Popover.Trigger asChild>
              <Button
                variant="outline"
                role="combobox"
                className="justify-between"
                full
              >
                <Avatar className="mr-2">
                  <Avatar.Fallback>NT</Avatar.Fallback>
                </Avatar>
                Netwan
                <ChevronsUpDown className="w-4 h-4 ml-auto opacity-50 shrink-0" />
              </Button>
            </Popover.Trigger>

            <Popover.Content className="p-0 w-popover">
              <Command>
                <Command.List>
                  <Command.InputWrapper>
                    <Command.Input placeholder="Search team..." />
                  </Command.InputWrapper>
                  <Command.Empty>No team found.</Command.Empty>
                </Command.List>
              </Command>
            </Popover.Content>
          </Popover>
        </div>
      </header>
    </Aside>
  )
}
