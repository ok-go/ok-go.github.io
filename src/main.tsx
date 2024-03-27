import { render } from 'preact'
import './index.css'
import { App } from "./components/app/app";

document.ondblclick = (e) => e.preventDefault()

render(<App />, document.getElementById('body')!)
