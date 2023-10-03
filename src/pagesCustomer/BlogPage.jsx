import React from 'react';

import Navbar from './components/Navbar/Navbar';
import Footer from './components/Footer/Footer';
import Home from './components/Home/Home';
import BlogPost from './components/BlogPost/BlogPost';
import AnimatedBox from '../components/AnimatedBox';

const BlogPage = () => {
	return (
		<>
			<Navbar />

			<AnimatedBox>
				<Home blog />

				<BlogPost />

				<Footer />
			</AnimatedBox>
		</>
	);
};

export default BlogPage;
