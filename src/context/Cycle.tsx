'use client'

import { createContext, ReactNode, useContext, useState } from 'react'
import { Cycle } from '../@types/CycleForm'

interface CycleProviderProps {
  children: ReactNode
}

interface CreateCycleData {
  task: string
  minutesAmount: number
}

interface CycleContextData {
  cycles: Cycle[]
  activeCycle: Cycle | undefined
  totalSecondsPassed: number
  handleCreateNewCycle: (data: CreateCycleData) => void
  markCurrentCycleFinished: () => void
  handleInterruptCycle: () => void
  handleSetSecondsPassed: (seconds: number) => void
}

const CycleContext = createContext({} as CycleContextData)

export function CycleProvider({ children }: CycleProviderProps) {
  const [cycles, setCycles] = useState<Cycle[]>([])
  const [activeCycleId, setActiveCycleId] = useState<string | null>(null)
  const [totalSecondsPassed, setTotalSecondsPassed] = useState(0)

  const activeCycle = cycles.find((cycle) => cycle.id === activeCycleId)

  function handleSetSecondsPassed(seconds: number) {
    setTotalSecondsPassed(seconds)
  }

  function handleCreateNewCycle(data: CreateCycleData) {
    const id = String(new Date().getTime())

    const newCycle: Cycle = {
      id,
      task: data.task,
      minutesAmount: data.minutesAmount,
      startDate: new Date(),
    }
    setCycles((state) => [...state, newCycle])
    setTotalSecondsPassed(0)
    setActiveCycleId(id)
    // reset()
  }
  function handleInterruptCycle() {
    setCycles((state) =>
      state.map((cycle) =>
        cycle.id === activeCycleId
          ? { ...cycle, interruptedDate: new Date() }
          : cycle,
      ),
    )
    setActiveCycleId(null)
  }
  function markCurrentCycleFinished() {
    setCycles((state) =>
      state.map((cycle) =>
        cycle.id === activeCycleId
          ? { ...cycle, finishedDate: new Date() }
          : cycle,
      ),
    )
    setActiveCycleId(null)
  }

  return (
    <CycleContext.Provider
      value={{
        cycles,
        activeCycle,
        totalSecondsPassed,
        handleCreateNewCycle,
        markCurrentCycleFinished,
        handleInterruptCycle,
        handleSetSecondsPassed,
      }}
    >
      {children}
    </CycleContext.Provider>
  )
}

export const useCycle = () => useContext(CycleContext)
