import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import App from './App.jsx';
import './index.css';
import { AuthProvider } from './context/AuthProvider.jsx';

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById('root')).render(
	<React.StrictMode>
		<QueryClientProvider client={queryClient}>
			<BrowserRouter>
				<AuthProvider>
					<App />
				</AuthProvider>
			</BrowserRouter>
		</QueryClientProvider>
	</React.StrictMode>
);
