import React from 'react'
import { ShowPropertyProps } from 'adminjs'
import { Label, Text } from '../design-system'

const Show: React.FC<ShowPropertyProps> = props => {
  const { record } = props
  return (
    <div style={{ marginBottom: 20 }}>
      <Label>Email</Label>
      <Text style={{ fontSize: 16 }}>{record?.params.email}</Text>
    </div>
  )
}

export default Show
