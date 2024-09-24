import React from 'react'
import { useCurrentAdmin, useNotice } from 'adminjs'
import { Box, Text, Button } from '../design-system'

type STATUS = 'unknown' | 'alive' | 'down'

const GpuSection: React.FC = () => {
  const noti = useNotice()
  const [admin] = useCurrentAdmin()

  const [loading, setLoading] = React.useState<boolean>(false)
  const [alive, setAlive] = React.useState<STATUS>('unknown')

  React.useEffect(() => {
    handleCheck()
  }, [])

  const handleCheck = React.useCallback(async () => {
    if (loading) return

    setLoading(true)
    try {
      const res = await fetch('private/gpu-control/check', {
        method: 'POST',
        headers: { Authorization: `Bearer ${admin?.accessToken}` },
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(JSON.stringify(data))
      }

      setAlive(data.ok ? 'alive' : 'down')
      noti({
        message: data.ok ? 'GPU server is alive' : 'GPU server is down',
      })
    } catch (e) {
      console.error(e)
      noti({ type: 'error', message: 'Failed to check GPU server' })
      setAlive('unknown')
    } finally {
      setLoading(false)
    }
  }, [loading])

  const handleTurnOn = React.useCallback(async () => {
    if (loading) return

    setLoading(true)
    try {
      const res = await fetch('private/gpu-control/on', {
        method: 'POST',
        headers: { Authorization: `Bearer ${admin?.accessToken}` },
      })
      const data = await res.json()

      if (!data.ok) {
        throw new Error(JSON.stringify(data))
      }

      noti({
        message: 'sucess to turn on GPU server, check again after a while',
      })
    } catch (e) {
      console.error(e)
      noti({ type: 'error', message: 'Failed to turn on GPU server' })
      setAlive('unknown')
    } finally {
      setLoading(false)
    }
  }, [loading])

  const handleTurnOff = React.useCallback(async () => {
    if (loading) return

    setLoading(true)
    try {
      const res = await fetch('private/gpu-control/off', {
        method: 'POST',
        headers: { Authorization: `Bearer ${admin?.accessToken}` },
      })
      const data = await res.json()

      if (!res.ok) {
        throw new Error(JSON.stringify(data))
      }

      noti({
        message: 'sucess to turn off GPU server, check again after a while',
      })
    } catch (e) {
      console.error(e)
      noti({ type: 'error', message: 'Failed to turn off GPU server' })
      setAlive('unknown')
    } finally {
      setLoading(false)
    }
  }, [loading])

  return (
    <Box
      bg="white"
      p="xl"
      boxShadow="card"
      borderRadius="default"
      style={{ marginBottom: 20 }}
    >
      <Text style={{ fontWeight: 'bold' }}>GPU Server</Text>
      <div>
        <div style={{ marginBottom: 10 }}>
          <span>status: </span>{' '}
          {loading ? <span>loading...</span> : <span>{alive}</span>}
        </div>

        <div>
          <Button style={{ marginRight: 10 }} size="sm" onClick={handleCheck}>
            check
          </Button>
          <Button style={{ marginRight: 10 }} size="sm" onClick={handleTurnOn}>
            On
          </Button>
          <Button size="sm" onClick={handleTurnOff}>
            Off
          </Button>
        </div>
      </div>
    </Box>
  )
}

export default GpuSection
