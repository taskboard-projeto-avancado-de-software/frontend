import "./styles/App.css";
import { Routes, Route } from "react-router-dom";
import SplashScreen from "./pages/SplashScreen";
import Login from "./pages/Login";
import Cadastro from "./pages/Cadastro";
import Criar from "./pages/CriarTarefas";
import PesquisaTarefas from "./pages/Pesquisa";
import Listagem from "./pages/Listagem";
import Editar from "./pages/Edição";

function App() {
  return (
    <Routes>
      <Route path="/" element={<SplashScreen />} />
      <Route path="/login" element={<Login />} />
      <Route path="/cadastro" element={<Cadastro />} />
      <Route path="/Criar" element={<Criar/>}></Route>
      <Route path="/pesquisar" element={<PesquisaTarefas/>}></Route>
      <Route path="/listar" element={<Listagem/>}></Route>
      <Route path="/editar" element={<Editar/>}></Route>

    </Routes>
  );
}

export default App;
