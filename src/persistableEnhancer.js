import { mqBig } from './config'
import { hemelblauw } from './colors'
import { Center, CoverPage } from './graphPickerSteps/Elements'
import { fadeInAnimation } from './styles'
import React from 'react'
import { isWritable, isPersistEnvTridion } from './store/persistTridion'
import {
	compose,
	withState,
	branch,
	lifecycle,
	renderComponent,
	nest,
} from 'recompose'
import glamorous from 'glamorous'

const delay = 600

const NotPersistableElement = nest(
	CoverPage,
	Center,
	glamorous.h1({
		animation: fadeInAnimation,
		color: hemelblauw.default,
		fontSize: '2.6rem',
		margin: '0 0 10% 0',
		textAlign: 'center',
		padding: '3rem',
		[mqBig]: {
			padding: '3rem 7rem',
		},
	}),
)
const NotPersistable = () => (
	<NotPersistableElement>
		Het Tridion-component kan niet worden aangepast. Mogelijk is het niet
		uitgecheckt.
	</NotPersistableElement>
)

const guardPersistableEnhancer = compose(
	withState('persistable', 'setPersistable', true),
	lifecycle({
		updatePersistable() {
			const nextPersistable = isWritable()
			if (this.props.persistable !== nextPersistable) {
				this.props.setPersistable(nextPersistable)
			}

			clearTimeout(this.timer)
			this.timer = setTimeout(this.updatePersistable, delay)
		},
		componentDidMount() {
			this.updatePersistable = this.updatePersistable.bind(this)
			this.updatePersistable()
		},
		componentWillUnmount() {
			clearTimeout(this.timer)
		},
	}),
	branch(({ persistable }) => !persistable, renderComponent(NotPersistable)),
)

export const persistableEnhancer = branch(
	isPersistEnvTridion,
	guardPersistableEnhancer,
)
