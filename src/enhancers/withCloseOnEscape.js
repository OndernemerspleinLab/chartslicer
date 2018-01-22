import { lifecycle } from 'recompose'

export const withCloseOnEscape = lifecycle({
	componentDidMount() {
		this.handleKeyDown = ({ key }) => {
			// 'Esc' for IE11 support
			if (key === 'Escape' || key === 'Esc') {
				if (this.props.close) this.props.close()
			}
		}
		document.addEventListener('keydown', this.handleKeyDown)
	},
	componentWillUnmount() {
		document.removeEventListener('keydown', this.handleKeyDown)
	},
})
