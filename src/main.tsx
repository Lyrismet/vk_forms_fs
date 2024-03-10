import {createRoot} from 'react-dom/client';
import {
    AdaptivityProvider,
    ConfigProvider
} from '@vkontakte/vkui';
import '@vkontakte/vkui/dist/vkui.css';
import App from './App';
import {QueryClient, QueryClientProvider} from "@tanstack/react-query";

const queryClient = new QueryClient();
const container = document.getElementById('root');
const root = createRoot(container!);
root.render(
    <ConfigProvider>
        <AdaptivityProvider>
            <QueryClientProvider client={queryClient}>
                <App/>
            </QueryClientProvider>
        </AdaptivityProvider>
    </ConfigProvider>,
);