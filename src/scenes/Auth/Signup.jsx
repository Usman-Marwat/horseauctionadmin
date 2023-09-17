import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import LinkMui from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { Link } from 'react-router-dom';
import OtpInput from 'react-otp-input';
import { useState } from 'react';
import { Backdrop, ButtonBase, Fade, Modal } from '@mui/material';

function Copyright(props) {
	return (
		<Typography
			variant="body2"
			color="text.secondary"
			align="center"
			{...props}
		>
			{'Copyright © '}
			<LinkMui color="inherit" href="https://horse-auction.vercel.app/">
				Horse Auction by Khinsa
			</LinkMui>{' '}
			{new Date().getFullYear()}
			{'.'}
		</Typography>
	);
}

export default function SignUp() {
	const [open, setOpen] = useState(false);

	const handleSubmit = (event) => {
		event.preventDefault();
		const data = new FormData(event.currentTarget);
		console.log({
			email: data.get('email'),
			password: data.get('password'),
		});
	};

	return (
		<Container component="main" maxWidth="xs">
			<Box
				sx={{
					marginTop: 8,
					display: 'flex',
					flexDirection: 'column',
					alignItems: 'center',
				}}
			>
				<Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
					<LockOutlinedIcon />
				</Avatar>
				<Typography component="h1" variant="h5">
					Sign up
				</Typography>
				<Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 3 }}>
					<Grid container spacing={2}>
						<Grid item xs={12} sm={6}>
							<TextField
								autoComplete="given-name"
								name="firstName"
								required
								fullWidth
								id="firstName"
								label="First Name"
								autoFocus
							/>
						</Grid>
						<Grid item xs={12} sm={6}>
							<TextField
								required
								fullWidth
								id="lastName"
								label="Last Name"
								name="lastName"
								autoComplete="family-name"
							/>
						</Grid>
						<Grid item xs={12}>
							<TextField
								required
								fullWidth
								id="email"
								label="Email Address"
								name="email"
								autoComplete="email"
							/>
						</Grid>
						<Grid item xs={12}>
							<TextField
								required
								fullWidth
								name="password"
								label="Password"
								type="password"
								id="password"
								autoComplete="new-password"
							/>
						</Grid>
						<Grid item xs={12}>
							<FormControlLabel
								control={<Checkbox value="allowExtraEmails" color="primary" />}
								label="I want to receive inspiration, marketing promotions and updates via email."
							/>
						</Grid>
					</Grid>
					<Button
						type="submit"
						fullWidth
						variant="contained"
						sx={{ mt: 3, mb: 2 }}
						onClick={() => setOpen(true)}
					>
						Sign Up
					</Button>
					<Grid container justifyContent="flex-end">
						<Grid item>
							<Link to="/signin" variant="body2">
								<Typography sx={{ textDecoration: 'underline' }}>
									Already have an account? Sign in
								</Typography>
							</Link>
						</Grid>
					</Grid>
				</Box>
			</Box>

			<Copyright sx={{ mt: 5 }} />
			<OTPModal open={open} setOpen={setOpen} />
		</Container>
	);
}

const OTPModal = ({ open, setOpen }) => {
	const [otp, setOtp] = useState();

	const handleOpen = () => setOpen(true);
	const handleClose = () => {
		// setOpen(false)
	};

	const style = {
		position: 'absolute',
		top: '50%',
		left: '50%',
		transform: 'translate(-50%, -50%)',
		width: 400,
		maxWidth: '90%',
		minHeight: 200,
		bgcolor: 'background.paper',
		border: '2px solid #000',
		boxShadow: 24,
		p: 4,
		borderRadius: 2,
	};
	return (
		<Modal
			aria-labelledby="transition-modal-title"
			aria-describedby="transition-modal-description"
			open={open}
			onClose={handleClose}
			closeAfterTransition
			slots={{ backdrop: Backdrop }}
			slotProps={{
				backdrop: {
					timeout: 500,
				},
			}}
		>
			<Fade in={open}>
				<Box sx={style}>
					<Typography
						variant="h5"
						component="h2"
						textAlign="center"
						fontWeight="bold"
					>
						Enter OTP send to the email
					</Typography>

					<Box marginTop={5}>
						<OtpInput
							value={otp}
							onChange={setOtp}
							numInputs={6}
							renderSeparator={<span>-</span>}
							renderInput={() => <TextField autoFocus />}
						/>
						<Box marginTop={2} textAlign="center">
							<Button variant="contained" onClick={() => setOpen(false)}>
								Send
							</Button>
						</Box>
					</Box>
				</Box>
			</Fade>
		</Modal>
	);
};
