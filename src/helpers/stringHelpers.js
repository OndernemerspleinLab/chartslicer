import { last, push } from './arrayHelpers'

const seperator = ' '
export const wordBreak = ({ sentence = '', lineLength }) => {
  const words = sentence.split(seperator)

  const splitSentence = words.reduce((lines, word) => {
    const lastLine = last(lines) || ''
    const appendedLastLine = lastLine.concat(seperator, word)

    if (appendedLastLine.length < lineLength) {
      return push(appendedLastLine)(lines.slice(0, -1))
    }

    return push(word)(lines)
  }, [])

  return splitSentence
}
