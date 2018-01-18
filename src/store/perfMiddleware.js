import Perf from 'react-addons-perf'

export const perfMiddleware = () => next => action => {
	Perf.start()
	const startTime = performance.now()
	next(action)
	const endTime = performance.now()
	Perf.stop()

	console.groupCollapsed('printInclusive')
	Perf.printInclusive()
	console.groupEnd()
	console.groupCollapsed('printExclusive')
	Perf.printExclusive()
	console.groupEnd()
	console.groupCollapsed('printWasted')
	Perf.printWasted()
	console.groupEnd()

	console.log('time in ms', endTime - startTime)
}
