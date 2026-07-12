import './index.css'
import { AppProvider } from './context/UserContext'
import { BrowserRouter } from "react-router-dom";
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import { ToastContainer, Bounce } from 'react-toastify';

createRoot(document.getElementById('root')).render(
    <BrowserRouter>
        <AppProvider>
            <App />
            <ToastContainer
                position="top-right"
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick={false}
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="light"
                transition={Bounce}
                toastClassName="text-md"
            />
        </AppProvider>
    </BrowserRouter>,
)
