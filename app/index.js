import React from 'react'
import ReactDOM from 'react-dom'
import './index.css';
import Popular from './components/Popular'

class App extends React.Component {
	render() {
		const languages = ["All", "Javascript", "Ruby", "Java", "CSS", "Python"]
		return (
			<div className="container">
				<Popular />
			</div>
		)
	}
}


ReactDOM.render(<App />, document.getElementById("app"))







// 1. webpack => bundle
// 2. Babel => transform jsx to js.