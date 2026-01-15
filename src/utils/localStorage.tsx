export function setItem(key: string, value: any) {
  try {
    window.localStorage.setItem(key, JSON.stringify(value)) //local storage only takes data in json form
  } catch (err) {
    console.log(err)
  }
}

export function getItem(key: string) {
  try {
    const item = window.localStorage.getItem(key)
    return item ? JSON.parse(item) : undefined
  } catch (err) {
    console.log(err)
  }
}
