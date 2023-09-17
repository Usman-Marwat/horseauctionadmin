import { Typography } from '@mui/material';
import React from 'react';
import { Link } from 'react-router-dom';

function Missing() {
	return (
		<div>
			<Typography>Page not Found</Typography>
			<Link to="/">Go Back to Home</Link>
		</div>
	);
}

export default Missing;
