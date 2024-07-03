import { BrowserRouter ,Routes,Route} from 'react-router-dom'
import Home from './pages/home/Home'
import Dashboard from './pages/dashboard/Dashboard'
import TaskShare from './pages/tasks/TaskShare'

function App() {

  return (
    <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home/>}/>
          <Route path="/dashboard" element={<Dashboard/>}/>
          <Route path="/taskUnique/:taskId" element={<TaskShare/>} />
        </Routes>
    </BrowserRouter>
  )
}

export default App
