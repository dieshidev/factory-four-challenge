import React from 'react'
import { FC } from 'react'
import { getStatusHealth } from '../utils/getStatusHealth'
import CardStatus from './CardStatus'

interface Health {
  success: boolean
  message: string
  hostname: string
  time: number
  name: string
}

const nameList = [
  'accounts',
  'assets',
  'customers',
  'datapoints',
  'devices',
  'documents',
  'forms',
  'invites',
  'media',
  'messages',
  'namespaces',
  'orders',
  'patients',
  'relationships',
  'rules',
  'templates',
  'users',
  'workflows',
]

export const StatusDashboard: FC = () => {
  const [data, setData] = React.useState<Health[]>([])
  const timeForEachRequest = 15000 // in milliseconds

  const getDataStatus = async () => {
    let arr: Health[] = []
    nameList.map(async name => {
      const response = ((await getStatusHealth(name)) as Health) || {
        success: false,
        name: name,
        hostname: 'OUTAGE 503',
        message: 'error',
        time: 0,
      }
      arr = [...arr, response]
      if (response) {
        setData(arr)
      }
    })
  }

  React.useEffect(() => {
    getDataStatus()
    setInterval(() => {
      getDataStatus()
    }, timeForEachRequest)
  }, [])

  const transformDate = () => {
    let string = null
    data.map(item => {
      if (item.time === 0) return

      let str = item?.time.toString()
      let date = new Date(Number(str))
      string = date.toLocaleString('en-US').split(' ')[1]
    })
    return string
  }

  return (
    <div>
      <nav className="navbar">
        <h2>Status Dashboard</h2>
      </nav>
      <main>
        {data.length === 18 &&
          data.map((item, i) => (
            <CardStatus
              key={i}
              name={item.name}
              success={item.success}
              hostname={item.hostname}
              message={item.message}
              time={transformDate()}
            />
          ))}
      </main>
    </div>
  )
}
