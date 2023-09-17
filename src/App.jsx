import { useState } from 'react';
import { CssBaseline, ThemeProvider } from '@mui/material';
import { Routes, Route } from 'react-router-dom';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';

import Topbar from './scenes/global/Topbar';
import Sidebar from './scenes/global/Sidebar';
import Dashboard from './scenes/dashboard';
import Team from './scenes/team';
import Invoices from './scenes/invoices';
// import Contacts from './scenes/contacts';
// import Bar from './scenes/bar';
// import Form from './scenes/form';
// import Line from './scenes/line';
// import Pie from './scenes/pie';
import FAQ from './scenes/faq';
// import Geography from './scenes/geography';
import { ColorModeContext, useMode } from './theme';
import Products from './scenes/products';
import AddProduct from './scenes/addProduct';
import SignUp from './scenes/Auth/Signup';
import SignIn from './scenes/Auth/Signin';
import RequireAuth from './scenes/RequireAuth';
import Missing from './scenes/Missing';

function App() {
	const [theme, colorMode] = useMode();
	const [isSidebar, setIsSidebar] = useState(true);

	return (
		<ColorModeContext.Provider value={colorMode}>
			<LocalizationProvider dateAdapter={AdapterDayjs}>
				<ThemeProvider theme={theme}>
					<CssBaseline />
					<div className="app">
						<Sidebar isSidebar={isSidebar} />
						<main className="content">
							<Topbar setIsSidebar={setIsSidebar} />
							<Routes>
								<Route path="/" element={<Dashboard />} />
								<Route path="/team" element={<Team />} />
								<Route path="/faq" element={<FAQ />} />
								<Route path="/invoices" element={<Invoices />} />

								<Route path="/signin" element={<SignIn />} />
								<Route path="/signup" element={<SignUp />} />

								{/*Protected Routes*/}
								<Route element={<RequireAuth />}>
									<Route path="/products" element={<Products />} />
									<Route path="/addProduct" element={<AddProduct />} />
								</Route>

								{/*Catch all*/}
								<Route path="*" element={<Missing />} />
							</Routes>
						</main>
					</div>
				</ThemeProvider>
			</LocalizationProvider>
		</ColorModeContext.Provider>
	);
}

export default App;
