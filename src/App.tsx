import { Routes, Route } from 'react-router-dom'
import { CartProvider } from './context/CartContext'
import Home              from './pages/Home'
import Builder           from './pages/Builder'
import Cupcakes          from './pages/Cupcakes'
import Themes            from './pages/Themes'
import Order             from './pages/Order'
import OrderConfirmation from './pages/OrderConfirmation'
import Catalogue         from './pages/Catalogue'
import Admin             from './pages/Admin'
import NotFound          from './pages/NotFound'

function App() {
  return (
    <CartProvider>
      <Routes>
        <Route path="/"                   element={<Home />} />
        <Route path="/catalogue"          element={<Catalogue />} />
        <Route path="/builder"            element={<Builder />} />
        <Route path="/cupcakes"           element={<Cupcakes />} />
        <Route path="/themes"             element={<Themes />} />
        <Route path="/order"              element={<Order />} />
        <Route path="/order/confirmation" element={<OrderConfirmation />} />
        <Route path="/admin"              element={<Admin />} />
        <Route path="*"                   element={<NotFound />} />
      </Routes>
    </CartProvider>
  )
}

export default App
