import { createFileRoute } from '@tanstack/react-router'

import FeatureGrid from '#/components/home/FeatureGrid'
import HeroTerminal from '#/components/home/HeroTerminal'
import InstallSection from '#/components/home/InstallSection'
import Layout from '#/components/Layout'

export const Route = createFileRoute('/')({ component: HomePage })

function HomePage() {
  return (
    <Layout>
      <HeroTerminal />
      <FeatureGrid />
      <InstallSection />
    </Layout>
  )
}
