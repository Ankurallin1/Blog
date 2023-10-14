import './App.css';
import Blogs from './Blogs';
import Error from './Error';
import {Routes,Route} from 'react-router-dom';
function App() {
  return (
    <Routes>
      <Route path='/' element={<Blogs/>}/>
      <Route path='/error' element={<Error/>}/>
    </Routes>
  );
}

export default App;
