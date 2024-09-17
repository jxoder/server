import React from 'react'
import { useNotice } from 'adminjs'
import { Box, Text, Button } from '../design-system'

type STATUS = 'unknown' | 'alive' | 'down'

const GpuSection: React.FC = () => {
  const noti = useNotice()

  const [loading, setLoading] = React.useState<boolean>(false)
  const [alive, setAlive] = React.useState<STATUS>('unknown')

  React.useEffect(() => {
    handleCheck()
  }, [])

  const handleCheck = React.useCallback(
    async (init?: boolean) => {
      if (loading) return

      setLoading(true)
      try {
        const res = await fetch('admin-api/gpu-control/check', {
          method: 'POST',
        })
        const data = await res.json()

        setAlive(data.ok ? 'alive' : 'down')
        noti({
          message: data.ok ? 'GPU server is alive' : 'GPU server is down',
        })
      } catch (e) {
        console.error(e)
        noti({ type: 'error', message: 'Failed to check GPU server' })
      } finally {
        setLoading(false)
      }
    },
    [loading],
  )

  const handleTurnOn = React.useCallback(async () => {
    if (loading) return

    setLoading(true)
    try {
      const res = await fetch('admin-api/gpu-control/on', { method: 'POST' })
      if (res.status !== 200) throw new Error('error')
      noti({
        message: 'sucess to turn on GPU server, check again after a while',
      })
    } catch (e) {
      console.error(e)
      noti({ type: 'error', message: 'Failed to turn on GPU server' })
    } finally {
      setLoading(false)
    }
  }, [loading])

  const handleTurnOff = React.useCallback(async () => {
    if (loading) return

    setLoading(true)
    try {
      const res = await fetch('admin-api/gpu-control/off', { method: 'POST' })
      if (res.status !== 200) throw new Error('error')
      noti({
        message: 'sucess to turn off GPU server, check again after a while',
      })
    } catch (e) {
      console.error(e)
      noti({ type: 'error', message: 'Failed to turn off GPU server' })
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
