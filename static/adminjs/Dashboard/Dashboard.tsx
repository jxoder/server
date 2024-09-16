import React from 'react'
import { useCurrentAdmin } from 'adminjs'
import { Box } from '../design-system'
import GpuSection from './GpuSection'

const Dashboard: React.FC = () => {
  const [admin] = useCurrentAdmin()

  return (
    <Box m="xl">
      <GpuSection />
    </Box>
  )
}

export default Dashboard
