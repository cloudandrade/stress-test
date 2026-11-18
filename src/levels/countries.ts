export const TARGET_COUNTRY = 'Brasil'
export const AUTO_DETECTED_COUNTRY = 'Brasilândia'

const DECOY_COUNTRIES = [
  'Afeganistão',
  'Alemanha',
  'Argentina',
  'Austrália',
  'Bélgica',
  'Bolívia',
  'Brasil (Colônia)',
  'Brasil Império',
  'Brasilândia',
  'Brasiu',
  'Brazil',
  'Bulgária',
  'Butão',
  'Canadá',
  'Chile',
  'Colômbia',
  'Dinamarca',
  'Equador',
  'Espanha',
  'França',
  'Grécia',
  'Islândia',
  'Japão',
  'México',
  'Noruega',
  'Paraguai',
  'Peru',
  'Portugal',
  'Uruguai',
  'Zimbábue',
]

export type CountryGroup = {
  label: string
  countries: string[]
}

export const COUNTRY_GROUPS: CountryGroup[] = [
  { label: 'Países', countries: DECOY_COUNTRIES },
  { label: 'Outros países que começam com B', countries: [TARGET_COUNTRY] },
]
