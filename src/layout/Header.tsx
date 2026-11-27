import { Anchor, Burger, Group, Title } from '@mantine/core';
import { Link } from 'react-router-dom';
import { UserMenu } from '@/layout/UserMenu';

type HeaderProps = {
  opened: boolean;
  onToggle: () => void;
};

export function Header({ opened, onToggle }: HeaderProps) {
  return (
    <Group h="100%" px="md" justify="space-between">
      <Group gap="sm">
        <Burger opened={opened} onClick={onToggle} hiddenFrom="sm" size="sm" aria-label="Menú" />
        <Anchor component={Link} to="/" underline="never" c="inherit">
          <Title order={3}>StreamFamily</Title>
        </Anchor>
      </Group>
      <UserMenu />
    </Group>
  );
}
