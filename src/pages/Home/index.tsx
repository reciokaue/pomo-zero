import { Play } from 'phosphor-react'
import {
  CountdownContainer,
  FormContainer,
  HomeContainer,
  Separator,
} from './styles'

export function Home() {
  return (
    <HomeContainer>
      <form>
        <FormContainer>
          <label htmlFor="task">Vou trabalhar em</label>
          <input type="text" name="" id="task" />

          <label htmlFor="minutesAmount">durante</label>
          <input type="text" name="" id="minutesAmount" />

          <span>minutos.</span>
        </FormContainer>
        <CountdownContainer>
          <span>0</span>
          <span>0</span>
          <Separator>:</Separator>
          <span>0</span>
          <span>0</span>
        </CountdownContainer>
        <button>
          <Play size={24} />
          Começar
        </button>
      </form>
    </HomeContainer>
  )
}
