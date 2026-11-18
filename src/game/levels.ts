import { CaptchaLevel } from '../levels/CaptchaLevel'
import { CertificateLevel } from '../levels/CertificateLevel'
import { CookieLevel } from '../levels/CookieLevel'
import { CountryLevel } from '../levels/CountryLevel'
import { FleeingButtonLevel } from '../levels/FleeingButtonLevel'
import { LoadingLevel } from '../levels/LoadingLevel'
import { NameLevel } from '../levels/NameLevel'
import { PasswordLevel } from '../levels/PasswordLevel'
import { PhoneLevel } from '../levels/PhoneLevel'
import { PreciseHoldLevel } from '../levels/PreciseHoldLevel'
import { TermsLevel } from '../levels/TermsLevel'
import { VolumeLevel } from '../levels/VolumeLevel'
import type { Level } from './types'

export const LEVELS: Level[] = [
  { id: 'cookies', title: 'Antes de tudo, os cookies', reward: 10, Component: CookieLevel },
  { id: 'name', title: 'Digite o seu nome', reward: 15, Component: NameLevel },
  { id: 'terms', title: 'Termos e condições', reward: 15, Component: TermsLevel },
  { id: 'password', title: 'Crie uma senha segura', reward: 25, Component: PasswordLevel },
  { id: 'country', title: 'Onde você mora?', reward: 15, Component: CountryLevel },
  {
    id: 'fleeing',
    title: 'É só clicar em Continuar',
    reward: 20,
    Component: FleeingButtonLevel,
    mobileVariant: { title: 'Segure por 2 segundos', Component: PreciseHoldLevel },
  },
  { id: 'phone', title: 'Informe seu celular', reward: 20, Component: PhoneLevel },
  { id: 'volume', title: 'Ajuste o volume', reward: 20, Component: VolumeLevel },
  { id: 'captcha', title: 'Prove que você é humano', reward: 25, Component: CaptchaLevel },
  { id: 'loading', title: 'Salvando seu progresso', reward: 30, Component: LoadingLevel },
  { id: 'certificate', title: 'Parabéns (eu acho)', reward: 0, Component: CertificateLevel },
]
