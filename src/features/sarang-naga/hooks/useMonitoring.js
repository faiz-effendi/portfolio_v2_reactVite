import { useEffect, useRef, useState } from 'react'
import { getSafeErrorMessage, validateMonitoringPayload } from '../lib/monitoringContract'

const POLL_INTERVAL_MS = 60_000
const STALE_AFTER_MS = 7 * 60_000

export const useMonitoring = () => {
  const [data, setData] = useState(null)
  const [error, setError] = useState(null)
  const [isFetching, setIsFetching] = useState(true)
  const [clock, setClock] = useState(0)
  const [refreshNonce, setRefreshNonce] = useState(0)
  const activeRequest = useRef(null)

  useEffect(() => {
    let active = true
    let timer

    const load = async () => {
      if (activeRequest.current) return
      const controller = new AbortController()
      activeRequest.current = controller
      setIsFetching(true)

      try {
        const response = await fetch('/api/sarang-naga/status', {
          headers: { Accept: 'application/json' },
          signal: controller.signal,
        })
        const contentType = response.headers.get('content-type') || ''
        if (!contentType.includes('application/json')) throw new Error('The monitoring endpoint returned an invalid response.')
        const payload = await response.json()
        if (!response.ok) throw new Error(getSafeErrorMessage(payload))
        if (!validateMonitoringPayload(payload)) throw new Error('The monitoring payload did not match the expected contract.')
        if (active) {
          setData(payload)
          setError(null)
          setClock(Date.now())
        }
      } catch (requestError) {
        if (active && requestError.name !== 'AbortError') setError(requestError.message)
      } finally {
        if (activeRequest.current === controller) activeRequest.current = null
        if (active) {
          setIsFetching(false)
          timer = window.setTimeout(load, POLL_INTERVAL_MS)
        }
      }
    }

    load()
    const clockTimer = window.setInterval(() => setClock(Date.now()), 30_000)
    return () => {
      active = false
      const controller = activeRequest.current
      controller?.abort()
      if (activeRequest.current === controller) activeRequest.current = null
      window.clearTimeout(timer)
      window.clearInterval(clockTimer)
    }
  }, [refreshNonce])

  const generatedAt = data ? new Date(data.generatedAt).getTime() : 0
  const isStale = Boolean(data && (error || !Number.isFinite(generatedAt) || clock - generatedAt > STALE_AFTER_MS))

  return {
    data,
    error,
    isInitialLoading: !data && isFetching,
    isRefreshing: Boolean(data && isFetching),
    isStale,
    refresh: () => {
      if (!isFetching) setRefreshNonce((value) => value + 1)
    },
  }
}
