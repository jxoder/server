import React from 'react'
import { useCurrentAdmin } from 'adminjs'
import { Box, Link } from '../design-system'
import GpuSection from './GpuSection'
import { IAdmin } from '../common'

const Dashboard: React.FC = () => {
  const [admin] = useCurrentAdmin()

  return (
    <Box m="xl">
      {(admin as IAdmin).roleLv >= 15 && <GpuSection />}
      <Box bg="white" p="xl" boxShadow="card" borderRadius="default">
        <Link href="/admin/bull" uppercase>
          Go to Queue Dashboard
        </Link>
      </Box>
    </Box>
  )
}

export default Dashboard
