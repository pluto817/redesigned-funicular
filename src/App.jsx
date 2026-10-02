import { Routes, Route } from 'react-router-dom'
import { SceneProvider } from './context/SceneContext.jsx'
import Home from './pages/Home.jsx'
import Island from './pages/Island.jsx'
import Onsen from './pages/Onsen.jsx'
import Cabin from './pages/Cabin.jsx'
import Garden from './pages/Garden.jsx'
import GrasslandHome from './pages/grassland/GrasslandHome.jsx'
import DandelionPage from './pages/grassland/DandelionPage.jsx'
import BridgePage from './pages/grassland/BridgePage.jsx'
import ForestPage from './pages/grassland/ForestPage.jsx'
import BookshelfPage from './pages/books/BookshelfPage.jsx'
import BookDetailPage from './pages/books/BookDetailPage.jsx'
import PictureBookPage from './pages/books/PictureBookPage.jsx'

function App() {
  return (
    <SceneProvider>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/island" element={<Island />} />
        <Route path="/onsen" element={<Onsen />} />
        <Route path="/cabin" element={<Cabin />} />
        <Route path="/garden" element={<Garden />} />
        {/* 草地探险 */}
        <Route path="/grassland" element={<GrasslandHome />} />
        <Route path="/grassland/dandelion" element={<DandelionPage />} />
        <Route path="/grassland/bridge" element={<BridgePage />} />
        <Route path="/grassland/forest" element={<ForestPage />} />
        {/* 心情绘本 */}
        <Route path="/books" element={<BookshelfPage />} />
        <Route path="/books/generate" element={<PictureBookPage />} />
        <Route path="/books/:id" element={<BookDetailPage />} />
      </Routes>
    </SceneProvider>
  )
}

export default App
