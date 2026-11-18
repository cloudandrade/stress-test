export function garbleName(firstName: string, petName: string, lastName: string): string {
  const scrambled = Array.from(`${petName}${lastName}`.replace(/\s/g, '').toLowerCase())
    .reverse()
    .join('')
  return `${firstName}${scrambled.charAt(0).toUpperCase()}${scrambled.slice(1)}`
}
