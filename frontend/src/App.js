import './App.css';
import {BrowserRouter as Router,Routes,Route} from 'react-router-dom';
import Home from './pages/home';
import Signup from './pages/signup';
import Termofuse from './pages/termofuse';
import Privacypolicy from './pages/privacypolicy';
import OtpVerification from './pages/otpVerification';
import Login from './pages/login';
import Profile from './pages/personalProfile';
import AllMentors from './pages/allMentors';
import OthersProfile from './pages/othersProfile';
import Chat from './pages/chat';

function App() {
  return (
    <Router>
      <Routes>
        <Route path='/' element={<Home/>}/>
        <Route path='/signup' element={<Signup/>}/>
        <Route path='/terms-of-use' element={<Termofuse/>}/>
        <Route path='/privacy-policy' element={<Privacypolicy/>}/>
        <Route path='/otp-verification' element={<OtpVerification/>}/>
        <Route path='/login' element={<Login/>}/>
        <Route path='/profile' element={<Profile/>}/>
        <Route path='/profile/:id' element={<OthersProfile/>}/>
        <Route path='/mentors' element={<AllMentors/>}/>
        <Route path='/chat' element={<Chat/>}/>
      </Routes>
    </Router>
  );
}

export default App;
