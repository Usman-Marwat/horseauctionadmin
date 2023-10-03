import React from 'react';

import Navbar from './components/Navbar/Navbar';
import Footer from './components/Footer/Footer';
import Home from './components/Home/Home';
import ProductFilter from './components/ProductFilter/ProductFilter';
import AnimatedBox from '../components/AnimatedBox';

const ProductsPage = () => {
	return (
		<>
			<Navbar />
			<AnimatedBox>
				<Home product />
				<div className="productsContainer">
					<div
						className="flex"
						style={{ justifyContent: 'space-between', margin: 20 }}
					>
						<ProductFilter />
						<span>Showing Results: 0</span>
						<span>Results Found: 0</span>
					</div>
				</div>
				<Footer />
			</AnimatedBox>
		</>
	);
};

export default ProductsPage;
