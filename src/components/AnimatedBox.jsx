import React from 'react';
import { motion } from 'framer-motion';

function AnimatedBox({ children }) {
	return (
		<motion.div
			initial={{ opacity: 0 }}
			animate={{ opacity: 1 }}
			exit={{ opacity: 1 }}
			transition={{ duration: 0.2, ease: 'easeIn' }}
		>
			{children}
		</motion.div>
	);
}

export default AnimatedBox;
