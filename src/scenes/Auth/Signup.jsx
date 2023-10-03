import { useState } from 'react';
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
import { Link, useNavigate } from 'react-router-dom';
import OtpInput from 'react-otp-input';
import {
	Alert,
	Backdrop,
	CircularProgress,
	Fade,
	Modal,
	Snackbar,
} from '@mui/material';
import { Formik } from 'formik';
import * as yup from 'yup';
import { useMutation } from '@tanstack/react-query';
import axios from 'axios';
import { MuiFileInput } from 'mui-file-input';
import Autocomplete from '@mui/material/Autocomplete';
import countriesList from '../../data/countriesList';
import ReactPhoneInput from 'react-phone-input-material-ui';
import { uploadImagesToCloudinary } from '../../config/cloudinary';
import useAuth from '../../hooks/useAuth';
import AnimatedBox from '../../components/AnimatedBox';

const baseURL = import.meta.env.VITE_REACT_APP_BASE_URL;

export default function SignUp() {
	const [open, setOpen] = useState(false);
	const [error, setError] = useState();
	const [formData, setFormData] = useState({});
	const [isSuccessSnack, setSuccessSnack] = useState(false);
	const [countryCode, setCountryCode] = useState();
	const [loading, setLoading] = useState(false);
	const navigate = useNavigate();
	const { setAuth } = useAuth();

	const otpApi = useMutation({
		mutationFn: (email) =>
			axios.post(`${baseURL}auth/generateOtp`, email).then((res) => res.data),
		onSuccess: ({ state_id }) => {
			console.log(state_id);
			setFormData({ ...formData, state_id });
			setOpen(true);
		},
		onError: ({ response }) => {
			setError(response.data.error);
		},
	});

	const registerApi = useMutation({
		mutationFn: (member) =>
			axios.post(`${baseURL}auth/signup`, member).then((res) => res.data),
		onSuccess: (savedMember) => {
			console.log(savedMember);
			loginApi.mutate(formData);
			setSuccessSnack(true);
		},
		onError: ({ response }) => {
			setError(response.data.error);
		},
	});

	const loginApi = useMutation({
		mutationFn: (member) =>
			axios.post(`${baseURL}auth/signin`, member).then((res) => res.data),
		onSuccess: ({ member, token }) => {
			setAuth(member);
			localStorage.setItem('auth', JSON.stringify({ member, token }));

			if (member.role === 'customer')
				return navigate('/auctions', { replace: true });
			navigate('/', { replace: true });
		},
	});

	const handleSignUp = async (otp) => {
		setLoading(true);
		try {
			const images = await uploadImagesToCloudinary(formData.imagesFiles);
			registerApi.mutate({
				...formData,
				otp,
				role: 'customer',
				idCardImages: images,
			});
			setLoading(false);
		} catch (error) {
			console.log(error);
			setLoading(false);
		}
	};

	const handleFormSubmit = async (values, { resetForm }) => {
		otpApi.mutate({ email: values.email });
		setFormData({ ...values, mobileNumber: `+${values.mobileNumber}` });

		if (!otpApi.isError) resetForm();
	};

	const handleSnackBarClose = (event, reason) => {
		if (reason === 'clickaway') return;
		setSuccessSnack(false);
	};

	return (
		<Container component="main" maxWidth="xs">
			<Backdrop
				sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
				open={otpApi.isLoading || registerApi.isLoading || loading}
			>
				<CircularProgress color="inherit" />
			</Backdrop>

			<Snackbar
				open={isSuccessSnack}
				autoHideDuration={5000}
				onClose={handleSnackBarClose}
			>
				<Alert
					onClose={() => setSuccessSnack(false)}
					severity="success"
					sx={{ width: '100%' }}
				>
					<Typography>You have successfully registered!</Typography>
				</Alert>
			</Snackbar>

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

				{error && <Typography color="red">{error}</Typography>}

				<Formik
					onSubmit={handleFormSubmit}
					initialValues={initialValues}
					validationSchema={validationSchema}
				>
					{({
						values,
						errors,
						touched,
						handleBlur,
						handleChange,
						handleSubmit,
						setFieldValue,
					}) => (
						<Box
							component="form"
							noValidate
							onSubmit={handleSubmit}
							sx={{ mt: 3 }}
						>
							<Grid container spacing={2}>
								<Grid item xs={12} sm={6}>
									<TextField
										fullWidth
										name="displayName"
										label="Display Name (Alias)"
										autoFocus
										onBlur={handleBlur}
										onChange={handleChange}
										value={values.displayName}
										error={!!touched.displayName && !!errors.displayName}
										helperText={touched.displayName && errors.displayName}
									/>
								</Grid>
								<Grid item xs={12} sm={6}>
									<TextField
										fullWidth
										name="legalName"
										label="Legal Name"
										onBlur={handleBlur}
										onChange={handleChange}
										value={values.legalName}
										error={!!touched.legalName && !!errors.legalName}
										helperText={touched.legalName && errors.legalName}
									/>
								</Grid>

								<Grid item xs={12}>
									<Autocomplete
										fullWidth
										options={countriesList}
										onChange={(_, country) => {
											if (country?.code) {
												setCountryCode(country.code.toLowerCase());
												setFieldValue('country', country.label, true);
											}
										}}
										getOptionLabel={(option) =>
											`${option.flag} ${option.label} (${option.code}) ${option.phone}`
										}
										renderInput={(params) => (
											<TextField
												{...params}
												name="country"
												label="Country"
												onBlur={handleBlur}
												value={values.country}
												error={!!touched.country && !!errors.country}
												helperText={touched.country && errors.country}
											/>
										)}
									/>
								</Grid>
								<Grid item xs={12}>
									<ReactPhoneInput
										placeholder="+92 317 12345678"
										country={countryCode}
										value={values.mobileNumber}
										onChange={(val) => setFieldValue('mobileNumber', val, true)}
										inputProps={{
											onBlur: handleBlur,
											name: 'mobileNumber',
											error: !!touched.mobileNumber && !!errors.mobileNumber,
											helperText: touched.mobileNumber && errors.mobileNumber,
										}}
										component={TextField}
									/>
								</Grid>

								<Grid item xs={12}>
									<TextField
										name="address"
										fullWidth
										label="Address"
										onBlur={handleBlur}
										onChange={handleChange}
										value={values.address}
										error={!!touched.address && !!errors.address}
										helperText={touched.address && errors.address}
									/>
								</Grid>
								<Grid item xs={12} sm={6}>
									<TextField
										label="ID card #"
										fullWidth
										name="idCardNo"
										onBlur={handleBlur}
										onChange={handleChange}
										value={values.idCardNo}
										error={!!touched.idCardNo && !!errors.idCardNo}
										helperText={touched.idCardNo && errors.idCardNo}
									/>
								</Grid>
								<Grid item xs={12} sm={6}>
									<MuiFileInput
										fullWidth
										multiple
										placeholder="ID card image(s)"
										error={!!touched.imagesFiles && !!errors.imagesFiles}
										helperText={touched.imagesFiles && errors.imagesFiles}
										value={values.imagesFiles}
										inputProps={{ accept: 'image/*' }}
										onChange={(value) =>
											setFieldValue('imagesFiles', value, true)
										}
									/>
								</Grid>

								<Grid item xs={12}>
									<TextField
										label="Email Address"
										fullWidth
										name="email"
										autoComplete="email"
										onBlur={handleBlur}
										onChange={handleChange}
										value={values.email}
										error={!!touched.email && !!errors.email}
										helperText={touched.email && errors.email}
									/>
								</Grid>
								<Grid item xs={12}>
									<TextField
										name="password"
										fullWidth
										label="Password"
										type="password"
										autoComplete="new-password"
										onBlur={handleBlur}
										onChange={handleChange}
										value={values.password}
										error={!!touched.password && !!errors.password}
										helperText={touched.password && errors.password}
									/>
								</Grid>

								<Grid item xs={12}>
									<FormControlLabel
										control={
											<Checkbox value="allowExtraEmails" color="primary" />
										}
										label="I want to receive inspiration, marketing promotions and updates via email."
									/>
								</Grid>
							</Grid>
							<Button
								type="submit"
								fullWidth
								variant="contained"
								sx={{ mt: 3, mb: 2 }}
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
					)}
				</Formik>
			</Box>

			<Copyright sx={{ mt: 5 }} />
			<OTPModal
				open={open}
				onSend={(otp) => {
					setOpen(false);
					handleSignUp(otp);
				}}
			/>
		</Container>
	);
}

const OTPModal = ({ open, onSend }) => {
	const [otp, setOtp] = useState();

	const handleOtpInput = () => {
		if (otp.toString().length) onSend(otp);
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
							inputStyle="inputStyle"
							numInputs={6}
							onChange={setOtp}
							renderSeparator={<span>-</span>}
							value={otp}
							inputType="tel"
							renderInput={(props) => (
								<input
									{...props}
									style={{
										height: 40,
										borderWidth: 1,
										minWidth: 40,
										textAlign: 'center',
									}}
								/>
							)}
							shouldAutoFocus
						/>
						<Box marginTop={2} textAlign="center">
							<Button variant="contained" onClick={handleOtpInput}>
								Send
							</Button>
						</Box>
					</Box>
				</Box>
			</Fade>
		</Modal>
	);
};

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

const validationSchema = yup.object().shape({
	displayName: yup.string().required().label('First name'),
	legalName: yup.string().required().label('Legal name'),
	country: yup.string().required().label('Country'),
	mobileNumber: yup.string().required().label('Mobile number'),
	address: yup.string().required().label('Address'),
	idCardNo: yup.string().required().label('ID Card No'),
	imagesFiles: yup.array().min(1, 'Please select atleast 1 image'),
	email: yup.string().required().label('Email'),
	password: yup.string().required().label('Password'),
});

const initialValues = {
	displayName: '',
	legalName: '',
	country: '',
	mobileNumber: '',
	address: '',
	idCardNo: '',
	imagesFiles: [],
	email: '',
	password: '',
};
