import { lifecycle } from 'recompose'

export const withCloseOnEscape = lifecycle({
	componentDidMount() {
		this.handleKeyDown = ({ key }) => {
			if (key === 'Escape') {
				if (this.props.close) this.props.close()
			}
		}
		document.addEventListener('keydown', this.handleKeyDown)
	},
	componentWillUnmount() {
		document.removeEventListener('keydown', this.handleKeyDown)
	},
})
