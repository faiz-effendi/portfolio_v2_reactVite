// @vitest-environment jsdom
import { cleanup, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { BrowserRouter } from 'react-router-dom'
import App from '../src/App.jsx'

const payload = {
  schemaVersion: 1,
  generatedAt: new Date().toISOString(),
  overallStatus: 'operational',
  summary: {
    total: 1,
    up: 1,
    down: 0,
    unknown: 0,
    averageUptime30d: 99.99,
    averageResponseTimeMs: 110,
  },
  services: [{
    id: 'portfolio',
    name: 'Faiz Effendi Portfolio',
    url: 'https://faizeffendi.online',
    status: 'up',
    uptime: { percentage: 99.99, windowDays: 30 },
    responseTime: { latestMs: 115, average24hMs: 110, min24hMs: 80, max24hMs: 180 },
    lastResponseSampleAt: new Date().toISOString(),
    history: {
      responseTime: [
        { timestamp: '2026-09-09T11:00:00.000Z', valueMs: 105 },
        { timestamp: '2026-09-09T12:00:00.000Z', valueMs: 115 },
      ],
    },
  }],
  warnings: [],
}

afterEach(() => {
  cleanup()
  vi.unstubAllGlobals()
})

describe('Sarang Naga page', () => {
  it('renders live monitoring data on its public route', async () => {
    window.history.pushState({}, '', '/sarang-naga')
    Object.defineProperty(window, 'scrollTo', { value: vi.fn(), configurable: true })
    vi.stubGlobal('fetch', vi.fn(async () => Response.json(payload)))

    render(<BrowserRouter><App /></BrowserRouter>)

    expect(await screen.findByRole('heading', { name: 'Operational' })).toBeTruthy()
    expect(screen.getByRole('heading', { name: 'Faiz Effendi Portfolio' })).toBeTruthy()
    expect(screen.getByRole('img', { name: /Response time over 24 hours/ })).toBeTruthy()
    expect(screen.queryByRole('link', { name: 'Sarang Naga' })).toBeNull()
    expect(screen.queryByText('Start a conversation')).toBeNull()
  })
})
