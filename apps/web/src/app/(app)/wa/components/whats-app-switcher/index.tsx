'use client'

import { Avatar } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Command } from '@/components/ui/command'
import { Popover } from '@/components/ui/popover'
import { cn } from '@/utils/cn'
import { Check } from 'lucide-react'
import { useState } from 'react'

const groups = [
  {
    label: 'Personal Account',
    teams: [
      {
        label: 'Alicia Koch',
        value: 'personal',
      },
    ],
  },
  {
    label: 'Teams',
    teams: [
      {
        label: 'Acme Inc.',
        value: 'acme-inc',
      },
      {
        label: 'Monsters Inc.',
        value: 'monsters',
      },
    ],
  },
]

type Team = (typeof groups)[number]['teams'][number]

export function WhatsAppSwitcher() {
  const [selectedTeam, setSelectedTeam] = useState<Team>(groups[0].teams[0])

  return (
    <Popover>
      <Popover.Trigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-label="Select a team"
          className="w-[200px] justify-between"
        >
          <Avatar className="mr-2 h-5 w-5">
            <Avatar.Image
              src={`https://avatar.vercel.sh/${selectedTeam.value}.png`}
              alt={selectedTeam.label}
              className="grayscale"
            />
            <Avatar.Fallback>SC</Avatar.Fallback>
          </Avatar>
          {selectedTeam.label}
        </Button>
      </Popover.Trigger>
      <Popover.Content className="w-[200px] p-0">
        <Command>
          <Command.List>
            <Command.Input placeholder="Search team..." />
            <Command.Empty>No team found.</Command.Empty>
            {groups.map((group) => (
              <Command.Group key={group.label} heading={group.label}>
                {group.teams.map((team) => (
                  <Command.Item
                    key={team.value}
                    onSelect={() => {
                      setSelectedTeam(team)
                    }}
                    className="text-sm"
                  >
                    <Avatar className="mr-2 h-5 w-5">
                      <Avatar.Image
                        src={`https://avatar.vercel.sh/${team.value}.png`}
                        alt={team.label}
                        className="grayscale"
                      />
                      <Avatar.Fallback>SC</Avatar.Fallback>
                    </Avatar>
                    {team.label}
                    <Check
                      className={cn(
                        'ml-auto h-4 w-4',
                        selectedTeam.value === team.value
                          ? 'opacity-100'
                          : 'opacity-0',
                      )}
                    />
                  </Command.Item>
                ))}
              </Command.Group>
            ))}
          </Command.List>
        </Command>
      </Popover.Content>
    </Popover>
  )
}
