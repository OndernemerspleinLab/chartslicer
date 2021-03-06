import { branch, renderNothing } from 'recompose'
import { unexisting } from '../helpers/helpers'

export const onlyWhenChildren = branch(
	({ children }) => unexisting(children) || children.length <= 0,
	renderNothing,
)
