'use client'

import {
  createContext,
  ReactNode,
  useContext,
  useReducer,
  useState,
} from 'react'
import { Cycle } from '../@types/CycleForm'
import { ActionTypes, cyclesReducer } from '../reducers/cycles'

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
  const [cyclesState, dispatchCycle] = useReducer(cyclesReducer, {
    cycles: [],
    activeCycleId: null,
  })
  const { cycles, activeCycleId } = cyclesState
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
    dispatchCycle({
      type: ActionTypes.ADD_NEW_CYCLE,
      payload: {
        newCycle,
      },
    })
    setTotalSecondsPassed(0)
  }
  function interruptCycle() {
    dispatchCycle({
      type: ActionTypes.INTERRUPT_CURRENT_CYCLE,
      payload: {
        activeCycleId,
      },
    })
  }
  function markCurrentCycleFinished() {
    dispatchCycle({
      type: ActionTypes.MARK_CURRENT_CYCLE_AS_FINISHED,
      payload: {
        activeCycleId,
      },
    })
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
