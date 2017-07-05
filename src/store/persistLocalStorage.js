import { localStorageKey } from './../config'

const canUseLocalStorage = () => {
  const testValue = new Date().toString()

  try {
    window.localStorage.setItem(testValue, testValue)
    const result = window.localStorage.getItem(testValue)
    window.localStorage.removeItem(testValue)

    return testValue === result
  } catch (error) {
    return false
  }
}

const getFromLocalStorage = () => {
  try {
    const data = JSON.parse(localStorage.getItem(localStorageKey))

    return typeof data === 'object' ? data : {}
  } catch (error) {
    return {}
  }
}

const setInLocalStorage = state => {
  const json = JSON.stringify(state)

  try {
    localStorage.setItem(localStorageKey, json)
  } catch (error) {}
}

export const canPersist = canUseLocalStorage
export const getPersistentData = getFromLocalStorage
export const setPersistentData = setInLocalStorage
