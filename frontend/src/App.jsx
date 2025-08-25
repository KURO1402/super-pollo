import './App.css'
import logo from '../public/logo.jpg'

function App() {

  return (
    <div className='flex justify-center items-center flex-col'>
      <h1 className='text-5xl'>Super pollo</h1>
      <img src={logo} alt='logo de super-pollo' className='pt-[150px]'/>
    </div>
     
  )
}

export default App
