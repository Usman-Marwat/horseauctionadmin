import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { AiFillCloseCircle } from 'react-icons/ai';
import { PiDotsNineBold } from 'react-icons/pi';

import './Navbar.css';
import logo from '../../../assets/homeImage.png';
import useAuth from '../../../hooks/useAuth';

function Navbar() {
	const [navbar, setNavbar] = useState('navbar');
	const [header, setHeader] = useState('header');
	const { auth } = useAuth();

	const showNavbar = () => setNavbar('navbar showNavbar');
	const removeNavbar = () => setNavbar('navbar');

	const addBg = () => {
		if (window.screenY >= 20) setHeader('header addBg');
	};

	window.addEventListener('scroll', addBg);

	return (
		<div className={header}>
			<Link to={'/'}>
				<div className="logoDiv flex">
					<img src={logo} alt="logo img" className="logo" />
					<span>Horse Auction</span>
				</div>
			</Link>

			<div className={navbar}>
				<ul className="menu">
					{auth.role && (
						<li className="listItem" onClick={removeNavbar}>
							<Link className="link" to="/auctions">
								Auctions
							</Link>
						</li>
					)}
					<li className="listItem" onClick={removeNavbar}>
						<Link className="link" to="/about">
							About Us
						</Link>
					</li>
					<li className="listItem" onClick={removeNavbar}>
						<Link className="link" to="/blog">
							Blog
						</Link>
					</li>
					<li className="listItem" onClick={removeNavbar}>
						<Link className="link" to="/products">
							Products
						</Link>
					</li>

					<li className="listItem" onClick={removeNavbar}>
						<Link className="link" to="/contact">
							Contact
						</Link>
					</li>
				</ul>
				<AiFillCloseCircle className="icon closeIcon" onClick={removeNavbar} />
			</div>

			{/* <button className="btn signUpBtn">Sign Up</button> */}
			<div className="signUp flex">
				<Link to="/signup">
					<div className="text">Sign Up</div>
				</Link>
				<PiDotsNineBold
					className="icon toggleNavbarIcon"
					onClick={showNavbar}
				/>
			</div>
		</div>
	);
}

export default Navbar;
