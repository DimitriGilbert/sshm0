import { createFileRoute } from '@tanstack/react-router'

import FeatureGrid from '#/components/home/FeatureGrid'
import HeroTerminal from '#/components/home/HeroTerminal'
import InstallSection from '#/components/home/InstallSection'
import Layout from '#/components/Layout'

export const Route = createFileRoute('/')({
  head: () => ({
    meta: [
      { title: 'sshm0 — SSH Connection Manager' },
      {
        name: 'description',
        content:
          'A lightweight SSH connection manager written in pure Bash. Add servers, connect by name, copy files — no daemons, no dependencies.',
      },
    ],
  }),
  component: HomePage,
})

function HomePage() {
  return (
    <Layout>
      <HeroTerminal />
      <FeatureGrid />
      <InstallSection />
    </Layout>
  )
}
