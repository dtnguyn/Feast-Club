
import React from 'react';
import ReactDOM from 'react-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './styles/index.css';
import './fonts/DancingScript-Bold.ttf'
import './fonts/DancingScript-Medium.ttf'
import './fonts/DancingScript-Regular.ttf'
import './fonts/DancingScript-SemiBold.ttf'

import App from './App';
import RegisterStatusPage from "./Components/RegisterPage/RegisterStatusPage"
import * as serviceWorker from './serviceWorker';

ReactDOM.render(<App />, document.getElementById('root'));

serviceWorker.unregister();
