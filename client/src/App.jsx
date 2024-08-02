import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Recorder from './Components/Assets/rcdr/Recorder';

// import { useGoogleLogin } from '@react-oauth/google';
import image from './unsplash.jpg';

function Login() {
  // const login = useGoogleLogin({
  //   onSuccess: tokenResponse => window.location.href = '/recorder',
  // })
  const LoginwithGoogle =()=>{
    window.open("http://localhost:6005/auth/google/callback","_self")
  }
  return ( 
    <div className='bg-cover h-[100vh] pt-10 text-white' style={{backgroundImage: `url(${image})`}}>
    <div className='bg-[rgb(0,0,0,0.7)] h-[12vh] max-w-sm border py-4 px-6 mx-auto my-56 rounded-2xl w-[400px]'>
    <button className='h-[7vh] mx-auto w-[320px] text-[28px]' onClick={() => LoginwithGoogle()}>Sign in with Google</button>
    </div>
    </div>
  );
}

function App() {
  return(
  <Router>
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/recorder" element={<Recorder />} />
    </Routes>
  </Router>
  );
}

export default App;
