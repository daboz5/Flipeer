import Router, { Route } from 'preact-router';
import { Toaster } from 'react-hot-toast';
import Game from './routes/Game';
import './app.css'

export function App() {

  return (
    <div id="app">

      <Toaster
        position="bottom-center"
        reverseOrder={false}
      />

      <Router>

        <Route path="/" component={Game} />

        <div default>
          <h3>Ta stran na tej domeni ne obstaja.</h3>
          <p>Poskusite "/" ali "/piratska-stranka"</p>
        </div>

      </Router>

    </div>
  )
}
