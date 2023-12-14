import { useEffect } from 'react'
import { CountdownContainer, Separator } from './styles'
import { differenceInSeconds } from 'date-fns'
import { useCycle } from '../../../../context/Cycle'

export function Countdown() {
  const {
    activeCycle,
    markCurrentCycleFinished,
    totalSecondsPassed,
    setSecondsPassed,
  } = useCycle()

  const totalSeconds = activeCycle ? activeCycle.minutesAmount * 60 : 0
  const currentSeconds = activeCycle ? totalSeconds - totalSecondsPassed : 0
  const minutesAmount = Math.floor(currentSeconds / 60)
  const secondsAmount = currentSeconds % 60

  const seconds = String(secondsAmount).padStart(2, '0')
  const minutes = String(minutesAmount).padStart(2, '0')

  useEffect(() => {
    let interval: number

    if (activeCycle) {
      interval = setInterval(() => {
        const seconds = differenceInSeconds(new Date(), activeCycle.startDate)

        if (seconds > totalSeconds) {
          markCurrentCycleFinished()
          clearInterval(interval)
        } else setSecondsPassed(seconds)
      }, 1000)
    }

    return () => {
      clearInterval(interval)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeCycle, totalSeconds])

  useEffect(() => {
    if (activeCycle)
      document.title = `${minutes}:${seconds} - ${activeCycle?.task}`
  }, [minutes, seconds, activeCycle])

  return (
    <CountdownContainer>
      <span>{minutes[0]}</span>
      <span>{minutes[1]}</span>
      <Separator>:</Separator>
      <span>{seconds[0]}</span>
      <span>{seconds[1]}</span>
    </CountdownContainer>
  )
}
