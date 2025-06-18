import { Header } from './components/Layout/Header';
import { GameContainer } from './components/Layout/GameContainer';
import { useAnalytics } from './hooks/useAnalytics';
import './App.css';

function App() {
  // Initialize analytics when the app starts
  useAnalytics();

  return (
    <div className='App'>
      <Header />
      <GameContainer />
    </div>
  );
}

export default App;
