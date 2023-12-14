'use client'

import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useReducer,
  useState,
} from 'react'
import { Cycle } from '../@types/CycleForm'
import { cyclesReducer } from '../reducers/cycles/reducer'
import {
  addNewCycleAction,
  interruptCurrentCycleAction,
  markCurrentCycleAsFinishedAction,
} from '../reducers/cycles/actions'
import { differenceInSeconds } from 'date-fns'

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
  const [cyclesState, dispatchCycle] = useReducer(
    cyclesReducer,
    {
      cycles: [],
      activeCycleId: null,
    },
    (initialState) => {
      const storedStateAsJson = localStorage.getItem(
        '@pomozero:cycles-state-1.0.0',
      )

      if (storedStateAsJson) return JSON.parse(storedStateAsJson)

      return initialState
    },
  )

  const { cycles, activeCycleId } = cyclesState
  const activeCycle = cycles.find((cycle) => cycle.id === activeCycleId)

  const [totalSecondsPassed, setTotalSecondsPassed] = useState(() => {
    if (activeCycle)
      return differenceInSeconds(new Date(), new Date(activeCycle.startDate))

    return 0
  })

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
    dispatchCycle(addNewCycleAction(newCycle))
    setTotalSecondsPassed(0)
  }
  function interruptCycle() {
    dispatchCycle(interruptCurrentCycleAction())
  }
  function markCurrentCycleFinished() {
    dispatchCycle(markCurrentCycleAsFinishedAction())
  }

  useEffect(() => {
    const stateJSON = JSON.stringify(cyclesState)

    localStorage.setItem('@pomozero:cycles-state-1.0.0', stateJSON)
  }, [cyclesState])

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
