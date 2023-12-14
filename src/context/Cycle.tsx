'use client'

import {
  createContext,
  ReactNode,
  useContext,
  useReducer,
  useState,
} from 'react'
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
  createNewCycle: (data: CreateCycleData) => void
  markCurrentCycleFinished: () => void
  interruptCycle: () => void
  setSecondsPassed: (seconds: number) => void
}

const CycleContext = createContext({} as CycleContextData)

export function CycleProvider({ children }: CycleProviderProps) {
  const [cycles, dispatchCycle] = useReducer((state: Cycle[], action: any) => {
    if (action.type === 'ADD_NEW_CYCLE')
      return [...state, action.payload.newCycle]

    return state
  }, [])

  const [activeCycleId, setActiveCycleId] = useState<string | null>(null)
  const [totalSecondsPassed, setTotalSecondsPassed] = useState(0)

  const activeCycle = cycles.find((cycle) => cycle.id === activeCycleId)

  function setSecondsPassed(seconds: number) {
    setTotalSecondsPassed(seconds)
  }

  function createNewCycle(data: CreateCycleData) {
    const id = String(new Date().getTime())

    const newCycle: Cycle = {
      id,
      task: data.task,
      minutesAmount: data.minutesAmount,
      startDate: new Date(),
    }
    // setCycles((state) => [...state, newCycle])
    dispatchCycle({
      type: 'ADD_NEW_CYCLE',
      payload: {
        newCycle,
      },
    })
    setTotalSecondsPassed(0)
    setActiveCycleId(id)
    // reset()
  }
  function interruptCycle() {
    // setCycles((state) =>
    //   state.map((cycle) =>
    //     cycle.id === activeCycleId
    //       ? { ...cycle, interruptedDate: new Date() }
    //       : cycle,
    //   ),
    // )
    dispatchCycle({
      type: 'INTERRRUPT_CURRENT_CYCLE',
      payload: {
        activeCycleId,
      },
    })
    setActiveCycleId(null)
  }
  function markCurrentCycleFinished() {
    // setCycles((state) =>
    //   state.map((cycle) =>
    //     cycle.id === activeCycleId
    //       ? { ...cycle, finishedDate: new Date() }
    //       : cycle,
    //   ),
    // )
    dispatchCycle({
      type: 'MARK_CURRENT_CYCLE_AS_FINISHED',
      payload: {
        activeCycleId,
      },
    })
    setActiveCycleId(null)
  }

  return (
    <CycleContext.Provider
      value={{
        cycles,
        activeCycle,
        totalSecondsPassed,
        createNewCycle,
        markCurrentCycleFinished,
        interruptCycle,
        setSecondsPassed,
      }}
    >
      {children}
    </CycleContext.Provider>
  )
}

export const useCycle = () => useContext(CycleContext)
