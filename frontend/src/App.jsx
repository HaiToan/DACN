import {Toaster} from 'sonner';
import {BrowserRouter, Routes, Route} from 'react-router';
import HomePage from './pages/HomePage';
import NotFound from './pages/NotFound';
import LoginRegister from './pages/LoginRegister';
import Menu from './pages/Menu';
import Cart from './pages/Cart';
import Booking from './pages/Booking';
import Orders from './pages/Orders';
import Feedback from './pages/Feedback';
import MainHome from './pages/MainHome';

function App() {

  return (
    <>
      <Toaster richColors/>
      
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<MainHome/>} />
          <Route path='/home' element={<HomePage/>} />
          <Route path='/login' element={<LoginRegister/>} />
          <Route path='/menu' element={<Menu/>} />
          <Route path='/cart' element={<Cart/>} />
          <Route path='/booking' element={<Booking/>} />
          <Route path='/orders' element={<Orders/>} />
          <Route path='/feedback' element={<Feedback/>} />
          <Route path='*' element={<NotFound/>} />
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
