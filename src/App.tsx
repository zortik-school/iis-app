import {CssBaseline, CssVarsProvider} from "@mui/joy";
import { BrowserRouter } from "react-router-dom";
import {Providers} from "./config/Providers.tsx";
import {Routes} from "./config/Routes.tsx";

import './assets/styles/globals.css'
import '@fontsource/inter/400.css';
import {ConfirmModalProvider} from "./components/modal/ConfirmModalProvider.tsx";
import {ConfirmModal} from "./components/modal/ConfirmModal.tsx";

function App() {
    return (
        <CssVarsProvider defaultMode="light">
            <CssBaseline />

            <ConfirmModalProvider>
                <ConfirmModal />

                <BrowserRouter>
                    <Providers>
                        <Routes />
                    </Providers>
                </BrowserRouter>
            </ConfirmModalProvider>
        </CssVarsProvider>
    )
}

export default App
