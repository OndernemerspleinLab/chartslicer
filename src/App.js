import { persistableEnhancer } from './persistableEnhancer'
import React from 'react'
import { GraphPicker } from './GraphPicker'
import { css } from 'glamor'
import { DataChart } from './DataChart'
import { DataInfo } from './DataInfo'
import { DataTable } from './DataTable'
import glamorous from 'glamorous'
import { mqBig, sidebarWidth } from './config'
import { hemelblauw, violet } from './colors'
import { Placeholder } from './Placeholder'
import { QueryDataLoadingIndicator } from './Loading'
import { DataQueryError } from './DataQueryError'
import { NoDataMessage } from './NoDataMessage'
import { sideScrollbarStyle, mainScrollbarStyle } from './styles'

// Each rule needs a seperate insert, because otherwise it will not work in production mode
css.insert(`
	* {
		box-sizing: border-box;
	}
`)
css.insert(`
	html {
		line-height: 1.5;
		color: ${hemelblauw.darkest};
	}
`)
css.insert(`
	${mqBig} {
		html, body {
			overflow: hidden;
		}
	}
`)

const Layout = glamorous.div({
	display: 'flex',
	flexDirection: 'column',
	minHeight: '100vh',
	[mqBig]: {
		justifyContent: 'stretch',
		flexDirection: 'row',
		height: '100vh',
	},
})

const Sidebar = glamorous.div(sideScrollbarStyle, {
	flex: 'none',
	overflowX: 'hidden',
	overflowY: 'auto',
	[mqBig]: {
		borderRight: `2px solid ${violet.default}`,
		width: sidebarWidth,
	},
})

const Main = glamorous.div(mainScrollbarStyle, {
	flex: 'auto',
	position: 'relative',
	backgroundColor: hemelblauw.lighter,
	[mqBig]: {
		height: '100%',
	},
})

const MainScrollArea = glamorous.div(mainScrollbarStyle, {
	width: '100%',
	height: '100%',
	flex: 'auto',
	position: 'relative',
	overflow: 'auto',
	padding: '0 1rem',
	[mqBig]: {
		padding: '0 3rem',
	},
})

export const App = persistableEnhancer(() => (
	<Layout>
		<Sidebar>
			<GraphPicker />
		</Sidebar>
		<Main>
			<MainScrollArea>
				<Placeholder />
				<DataInfo />
				<DataChart />
				<DataTable />
				<NoDataMessage />
			</MainScrollArea>
			<QueryDataLoadingIndicator />
			<DataQueryError />
		</Main>
	</Layout>
))
