import {
	Alert,
	Backdrop,
	Box,
	Button,
	CircularProgress,
	FormControl,
	FormControlLabel,
	FormLabel,
	Radio,
	RadioGroup,
	Snackbar,
	Tab,
	TextField,
	Typography,
} from '@mui/material';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import {
	DatePicker,
	TimePicker,
	renderTimeViewClock,
} from '@mui/x-date-pickers';
import { Formik } from 'formik';
import * as yup from 'yup';

import useMediaQuery from '@mui/material/useMediaQuery';

import { useState } from 'react';
import { MuiFileInput } from 'mui-file-input';
import { useMutation } from '@tanstack/react-query';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { ArrowRight } from '@mui/icons-material';
import Header from '../components/Header';
import Navbar from './components/Navbar/Navbar';
import { uploadImagesToCloudinary } from '../config/cloudinary';

const baseUrl = import.meta.env.VITE_REACT_APP_BASE_URL;

export default () => {
	const isNonMobile = useMediaQuery('(min-width:600px)');

	return (
		<>
			<Navbar />
			<Box p="20px">
				<Header title="CREATE AUCTION" subtitle="Create a New Auction" />
				<TabViews isNonMobile={isNonMobile} />
			</Box>
		</>
	);
};

const TabViews = ({ isNonMobile }) => {
	const [value, setValue] = useState('1');

	const handleChange = (e) => {
		switch (e.target.textContent) {
			case 'Fixed Price Auction':
				setValue('1');
				break;
			case 'Realtime Auction':
				setValue('2');
				break;
		}
	};

	return (
		<>
			<TabContext value={value}>
				<Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
					<TabList
						onChange={handleChange}
						aria-label="lab API tabs example"
						centered={isNonMobile}
					>
						<Tab label="Fixed Price Auction" value="1" />
						<Tab label="Realtime Auction" value="2" />
					</TabList>
				</Box>
				<TabPanel value="1">
					<FixedPriceAuction isNonMobile={isNonMobile} />
				</TabPanel>
				<TabPanel value="2">
					<RealTimeAuction isNonMobile={isNonMobile} />
				</TabPanel>
			</TabContext>
		</>
	);
};

const FixedPriceAuction = ({ isNonMobile }) => {
	const [isSuccessSnack, setSuccessSnack] = useState(false);
	const [errorSnack, setErrorSnack] = useState(true);
	const [loading, setLoading] = useState(false);

	const handleSnackBarClose = (event, reason) => {
		if (reason === 'clickaway') return;
		setSuccessSnack(false);
	};

	const addAuction = useMutation({
		mutationFn: (auction) =>
			axios.post(`${baseUrl}auctionRequest`, auction).then((res) => res.data),
		onSuccess: (savedAuction, sentAuction) => {
			console.log(savedAuction);
			setSuccessSnack(true);
		},
	});

	const handleFormSubmit = async (values, { resetForm }) => {
		setLoading(true);
		try {
			const images = await uploadImagesToCloudinary(values.imagesFiles);
			addAuction.mutate({ type: 'Fixed', ...values, images });
			setLoading(false);
		} catch (error) {
			console.log(error);
		}

		if (!addAuction.isError) resetForm();
	};

	return (
		<>
			<Backdrop
				sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
				open={addAuction.isLoading || loading}
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
					<Typography>Auction request successfully made!</Typography>
				</Alert>
			</Snackbar>
			{addAuction.isError && (
				<Snackbar
					open={errorSnack}
					autoHideDuration={5000}
					onClose={() => setErrorSnack(false)}
				>
					<Alert
						onClose={() => setErrorSnack(false)}
						severity="error"
						sx={{ width: '100%' }}
					>
						Error Creating Auction!
					</Alert>
				</Snackbar>
			)}

			<Formik
				onSubmit={handleFormSubmit}
				initialValues={initialValues}
				validationSchema={fixedPriceAuctionSchema}
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
					<form onSubmit={handleSubmit}>
						<Box
							display="grid"
							gap="30px"
							gridTemplateColumns="repeat(4, minmax(0, 1fr))"
							sx={{
								'& > div': { gridColumn: isNonMobile ? undefined : 'span 4' },
							}}
						>
							<TextField
								fullWidth
								variant="filled"
								type="text"
								label="Auctioneer Name"
								onBlur={handleBlur}
								onChange={handleChange}
								value={values.auctioneer}
								name="auctioneer"
								error={!!touched.auctioneer && !!errors.auctioneer}
								helperText={touched.auctioneer && errors.auctioneer}
								sx={{ gridColumn: 'span 4' }}
							/>

							<FormControl
								error={!!touched.breed && !!errors.breed}
								sx={{ gridColumn: 'span 1' }}
							>
								<FormLabel id="demo-radio-buttons-group-label">
									Horse Breed
								</FormLabel>
								<RadioGroup
									aria-labelledby="demo-radio-buttons-group-label"
									name="breed"
									onBlur={handleBlur}
									onChange={handleChange}
									value={values.breed}
								>
									<FormControlLabel value="ar" control={<Radio />} label="AR" />
									<FormControlLabel
										value="t.b."
										control={<Radio />}
										label="T.B."
									/>
									<FormControlLabel
										value="n/tb"
										control={<Radio />}
										label="N/TB"
									/>
									<FormControlLabel
										value="other"
										control={<Radio />}
										label="Other"
									/>
								</RadioGroup>
							</FormControl>

							<FormControl
								error={!!touched.color && !!errors.color}
								sx={{ gridColumn: 'span 1' }}
							>
								<FormLabel id="demo-radio-buttons-group-label">
									Horse Color
								</FormLabel>
								<RadioGroup
									aria-labelledby="demo-radio-buttons-group-label"
									name="color"
									onBlur={handleBlur}
									onChange={handleChange}
									value={values.color}
								>
									<FormControlLabel
										value="bay"
										control={<Radio />}
										label="Bay"
									/>
									<FormControlLabel
										value="grey"
										control={<Radio />}
										label="Grey"
									/>
									<FormControlLabel
										value="chestnut"
										control={<Radio />}
										label="Chestnut"
									/>
									<FormControlLabel
										value="black"
										control={<Radio />}
										label="Black"
									/>
								</RadioGroup>
							</FormControl>

							<FormControl
								error={!!touched.sex && !!errors.sex}
								sx={{ gridColumn: 'span 1' }}
							>
								<FormLabel id="demo-radio-buttons-group-label">
									Horse Sex
								</FormLabel>
								<RadioGroup
									aria-labelledby="demo-radio-buttons-group-label"
									name="sex"
									onBlur={handleBlur}
									onChange={handleChange}
									value={values.sex}
								>
									<FormControlLabel
										value="female"
										control={<Radio />}
										label="Female"
									/>
									<FormControlLabel
										value="male"
										control={<Radio />}
										label="Male"
									/>
									<FormControlLabel
										value="gelding"
										control={<Radio />}
										label="Gelding"
									/>
								</RadioGroup>
							</FormControl>

							<TextField
								fullWidth
								variant="filled"
								type="text"
								label="Horse Sire"
								onBlur={handleBlur}
								onChange={handleChange}
								value={values.sire}
								name="sire"
								error={!!touched.sire && !!errors.sire}
								helperText={touched.sire && errors.sire}
								sx={{ gridColumn: 'span 2' }}
							/>

							<TextField
								fullWidth
								variant="filled"
								type="text"
								label="Horse Dam"
								onBlur={handleBlur}
								onChange={handleChange}
								value={values.dam}
								name="dam"
								error={!!touched.dam && !!errors.dam}
								helperText={touched.dam && errors.dam}
								sx={{ gridColumn: 'span 2' }}
							/>

							<Box sx={{ gridColumn: 'span 2' }}>
								<DatePicker
									sx={{ width: '100%' }}
									disableFuture
									label="Date of Birth"
									format="DD/MM/YYYY"
									value={values.dateOfBirth}
									onChange={(value) =>
										setFieldValue('dateOfBirth', value, true)
									}
									slotProps={{
										textField: {
											variant: 'outlined',
											error: !!touched.dateOfBirth && !!errors.dateOfBirth,
											helperText: touched.dateOfBirth && errors.dateOfBirth,
											onBlur: handleBlur,
										},
									}}
								/>
							</Box>

							<Box sx={{ gridColumn: 'span 2' }}>
								<DatePicker
									sx={{ width: '100%' }}
									label="Date of Auction"
									format="DD/MM/YYYY"
									value={values.dateOfAuction}
									onChange={(value) =>
										setFieldValue('dateOfAuction', value, true)
									}
									slotProps={{
										textField: {
											variant: 'outlined',
											error: !!touched.dateOfAuction && !!errors.dateOfAuction,
											helperText: touched.dateOfAuction && errors.dateOfAuction,
											onBlur: handleBlur,
										},
									}}
								/>
							</Box>

							<FormControl
								error={!!touched.location && !!errors.location}
								sx={{ gridColumn: 'span 4' }}
							>
								<FormLabel id="demo-radio-buttons-group-label">
									Location
								</FormLabel>
								<RadioGroup
									aria-labelledby="demo-radio-buttons-group-label"
									name="location"
									onBlur={handleBlur}
									onChange={handleChange}
									value={values.location}
								>
									<FormControlLabel
										value="online"
										control={<Radio />}
										label="Online"
									/>
									<FormControlLabel
										value="venue"
										control={<Radio />}
										label="Enter Venue"
									/>
								</RadioGroup>

								{values.location === 'venue' && (
									<TextField
										fullWidth
										variant="filled"
										type="text"
										label="Venue"
										onBlur={handleBlur}
										onChange={handleChange}
										value={values.venue}
										name="venue"
										error={!!touched.venue && !!errors.venue}
										helperText={touched.venue && errors.venue}
										sx={{ gridColumn: 'span 2' }}
									/>
								)}
							</FormControl>

							<TimePicker
								label="Start Time For Auction"
								value={values.startTime}
								viewRenderers={{
									hours: renderTimeViewClock,
									minutes: renderTimeViewClock,
									seconds: renderTimeViewClock,
								}}
								onChange={(value) => setFieldValue('startTime', value, true)}
								slotProps={{
									textField: {
										variant: 'outlined',
										error: !!touched.startTime && !!errors.startTime,
										helperText: touched.startTime && errors.startTime,
										onBlur: handleBlur,
									},
								}}
								sx={{ gridColumn: 'span 2' }}
							/>

							<MuiFileInput
								multiple
								placeholder="Add Images"
								error={!!touched.imagesFiles && !!errors.imagesFiles}
								helperText={touched.imagesFiles && errors.imagesFiles}
								value={values.imagesFiles}
								onChange={(value) => setFieldValue('imagesFiles', value, true)}
								inputProps={{ accept: 'image/*' }}
								sx={{ gridColumn: 'span 2' }}
							/>
						</Box>
						<Box display="flex" justifyContent="end" mt="20px">
							<Button type="submit" color="secondary" variant="contained">
								Make Auction Request
							</Button>
						</Box>
					</form>
				)}
			</Formik>
		</>
	);
};

const RealTimeAuction = ({ isNonMobile }) => {
	const [isSuccessSnack, setSuccessSnack] = useState(false);
	const [errorSnack, setErrorSnack] = useState(true);
	const navigate = useNavigate();

	const handleSnackBarClose = (event, reason) => {
		if (reason === 'clickaway') return;
		setSuccessSnack(false);
	};

	const addAuction = useMutation({
		mutationFn: (auction) =>
			axios.post(`${baseUrl}auctionRequest`, auction).then((res) => res.data),
		onSuccess: (savedAuction, sentAuction) => {
			console.log(savedAuction);
			setSuccessSnack(true);
		},
	});

	const handleFormSubmit = async (values, { resetForm }) => {
		try {
			const images = await uploadImagesToCloudinary(values.imagesFiles);
			addAuction.mutate({ type: 'Realtime', ...values, images });
			resetForm();
		} catch (error) {
			console.log(error);
		}
	};

	return (
		<>
			<Backdrop
				sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
				open={addAuction.isLoading}
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
					<Typography>Auction request successfully made!</Typography>
				</Alert>
			</Snackbar>
			{addAuction.isError && (
				<Snackbar
					open={errorSnack}
					autoHideDuration={5000}
					onClose={() => setErrorSnack(false)}
				>
					<Alert
						onClose={() => setErrorSnack(false)}
						severity="error"
						sx={{ width: '100%' }}
					>
						Error Creating Auction!
					</Alert>
				</Snackbar>
			)}

			<Formik
				onSubmit={handleFormSubmit}
				initialValues={initialValues2}
				validationSchema={realTimeAuctionSchema}
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
					<form onSubmit={handleSubmit}>
						<Box
							display="grid"
							gap="30px"
							gridTemplateColumns="repeat(4, minmax(0, 1fr))"
							sx={{
								'& > div': { gridColumn: isNonMobile ? undefined : 'span 4' },
							}}
						>
							<TextField
								fullWidth
								variant="filled"
								type="text"
								label="Auctioneer Name"
								onBlur={handleBlur}
								onChange={handleChange}
								value={values.auctioneer}
								name="auctioneer"
								error={!!touched.auctioneer && !!errors.auctioneer}
								helperText={touched.auctioneer && errors.auctioneer}
								sx={{ gridColumn: 'span 4' }}
							/>

							<FormControl
								error={!!touched.breed && !!errors.breed}
								sx={{ gridColumn: 'span 1' }}
							>
								<FormLabel id="demo-radio-buttons-group-label">Breed</FormLabel>
								<RadioGroup
									aria-labelledby="demo-radio-buttons-group-label"
									name="breed"
									onBlur={handleBlur}
									onChange={handleChange}
									value={values.breed}
								>
									<FormControlLabel value="ar" control={<Radio />} label="AR" />
									<FormControlLabel
										value="t.b."
										control={<Radio />}
										label="T.B."
									/>
									<FormControlLabel
										value="n/tb"
										control={<Radio />}
										label="N/TB"
									/>
									<FormControlLabel
										value="other"
										control={<Radio />}
										label="Other"
									/>
								</RadioGroup>
							</FormControl>

							<FormControl
								error={!!touched.color && !!errors.color}
								sx={{ gridColumn: 'span 1' }}
							>
								<FormLabel id="demo-radio-buttons-group-label">Color</FormLabel>
								<RadioGroup
									aria-labelledby="demo-radio-buttons-group-label"
									name="color"
									onBlur={handleBlur}
									onChange={handleChange}
									value={values.color}
								>
									<FormControlLabel
										value="bay"
										control={<Radio />}
										label="Bay"
									/>
									<FormControlLabel
										value="grey"
										control={<Radio />}
										label="Grey"
									/>
									<FormControlLabel
										value="chestnut"
										control={<Radio />}
										label="Chestnut"
									/>
									<FormControlLabel
										value="black"
										control={<Radio />}
										label="Black"
									/>
								</RadioGroup>
							</FormControl>

							<FormControl
								error={!!touched.sex && !!errors.sex}
								sx={{ gridColumn: 'span 1' }}
							>
								<FormLabel id="demo-radio-buttons-group-label">Sex</FormLabel>
								<RadioGroup
									aria-labelledby="demo-radio-buttons-group-label"
									name="sex"
									onBlur={handleBlur}
									onChange={handleChange}
									value={values.sex}
								>
									<FormControlLabel
										value="female"
										control={<Radio />}
										label="Female"
									/>
									<FormControlLabel
										value="male"
										control={<Radio />}
										label="Male"
									/>
									<FormControlLabel
										value="gelding"
										control={<Radio />}
										label="Gelding"
									/>
								</RadioGroup>
							</FormControl>

							<TextField
								fullWidth
								variant="filled"
								type="text"
								label="Sire"
								onBlur={handleBlur}
								onChange={handleChange}
								value={values.sire}
								name="sire"
								error={!!touched.sire && !!errors.sire}
								helperText={touched.sire && errors.sire}
								sx={{ gridColumn: 'span 2' }}
							/>

							<TextField
								fullWidth
								variant="filled"
								type="text"
								label="Dam"
								onBlur={handleBlur}
								onChange={handleChange}
								value={values.dam}
								name="dam"
								error={!!touched.dam && !!errors.dam}
								helperText={touched.dam && errors.dam}
								sx={{ gridColumn: 'span 2' }}
							/>

							<Box sx={{ gridColumn: 'span 2' }}>
								<DatePicker
									disableFuture
									sx={{ width: '100%' }}
									label="Date of Birth"
									format="DD/MM/YYYY"
									value={values.dateOfBirth}
									onChange={(value) =>
										setFieldValue('dateOfBirth', value, true)
									}
									slotProps={{
										textField: {
											variant: 'outlined',
											error: !!touched.dateOfBirth && !!errors.dateOfBirth,
											helperText: touched.dateOfBirth && errors.dateOfBirth,
											onBlur: handleBlur,
										},
									}}
								/>
							</Box>

							<Box sx={{ gridColumn: 'span 2' }}>
								<DatePicker
									sx={{ width: '100%' }}
									label="Date of Auction"
									format="DD/MM/YYYY"
									value={values.dateOfAuction}
									onChange={(value) =>
										setFieldValue('dateOfAuction', value, true)
									}
									slotProps={{
										textField: {
											variant: 'outlined',
											error: !!touched.dateOfAuction && !!errors.dateOfAuction,
											helperText: touched.dateOfAuction && errors.dateOfAuction,
											onBlur: handleBlur,
										},
									}}
								/>
							</Box>

							<FormControl
								error={!!touched.location && !!errors.location}
								sx={{ gridColumn: 'span 4' }}
							>
								<FormLabel id="demo-radio-buttons-group-label">
									Location
								</FormLabel>
								<RadioGroup
									aria-labelledby="demo-radio-buttons-group-label"
									name="location"
									onBlur={handleBlur}
									onChange={handleChange}
									value={values.location}
								>
									<FormControlLabel
										value="online"
										control={<Radio />}
										label="Online"
									/>
									<FormControlLabel
										value="venue"
										control={<Radio />}
										label="Enter Venue"
									/>
								</RadioGroup>

								{values.location === 'venue' && (
									<TextField
										fullWidth
										variant="filled"
										type="text"
										label="Venue"
										onBlur={handleBlur}
										onChange={handleChange}
										value={values.venue}
										name="venue"
										error={!!touched.venue && !!errors.venue}
										helperText={touched.venue && errors.venue}
										sx={{ gridColumn: 'span 2' }}
									/>
								)}
							</FormControl>

							<TimePicker
								label="Start Time For Auction"
								value={values.startTime}
								viewRenderers={{
									hours: renderTimeViewClock,
									minutes: renderTimeViewClock,
									seconds: renderTimeViewClock,
								}}
								onChange={(value) => setFieldValue('startTime', value, true)}
								slotProps={{
									textField: {
										variant: 'outlined',
										error: !!touched.startTime && !!errors.startTime,
										helperText: touched.startTime && errors.startTime,
										onBlur: handleBlur,
									},
								}}
								sx={{ gridColumn: 'span 2' }}
							/>
							<TimePicker
								label="End Time For Auction"
								value={values.endTime}
								viewRenderers={{
									hours: renderTimeViewClock,
									minutes: renderTimeViewClock,
									seconds: renderTimeViewClock,
								}}
								onChange={(value) => setFieldValue('endTime', value, true)}
								slotProps={{
									textField: {
										variant: 'outlined',
										error: !!touched.endTime && !!errors.endTime,
										helperText: touched.endTime && errors.endTime,
										onBlur: handleBlur,
									},
								}}
								sx={{ gridColumn: 'span 2' }}
							/>

							<MuiFileInput
								multiple
								placeholder="Add Images"
								error={!!touched.imagesFiles && !!errors.imagesFiles}
								helperText={touched.imagesFiles && errors.imagesFiles}
								value={values.imagesFiles}
								onChange={(value) => setFieldValue('imagesFiles', value, true)}
								inputProps={{ accept: 'image/*' }}
								sx={{ gridColumn: 'span 2' }}
							/>
						</Box>
						<Box display="flex" justifyContent="end" mt="20px">
							<Button type="submit" color="secondary" variant="contained">
								Make Auction Request
							</Button>
						</Box>
					</form>
				)}
			</Formik>
		</>
	);
};

const fixedPriceAuctionSchema = yup.object().shape({
	auctioneer: yup.string().required().label('Auctioneer'),
	breed: yup.string().required().label('Breed'),
	location: yup.string().required().label('Location'),
	color: yup.string().required().label('Color'),
	sex: yup.string().required().label('Sex'),
	sire: yup.string().required().label('Horse sire'),
	dam: yup.string().required().label('Horse dime'),
	dateOfBirth: yup.object().required().label('Date of Birth'),
	dateOfAuction: yup.string().required().label('Auction'),
	venue: yup.string().label('Venue'),
	startTime: yup.object().required().label('Start time for auction'),
	imagesFiles: yup.array().min(1, 'Please select atleast 1 image'),
});

const initialValues = {
	auctioneer: '',
	breed: '',
	breed: '',
	color: '',
	sex: '',
	sire: '',
	dam: '',
	dateOfBirth: null,
	dateOfAuction: null,
	venue: '',
	startTime: null,
	imagesFiles: [],
};

const realTimeAuctionSchema = yup.object().shape({
	auctioneer: yup.string().required().label('Auctioneer'),
	breed: yup.string().required().label('Breed'),
	location: yup.string().required().label('Location'),
	color: yup.string().required().label('Color'),
	sex: yup.string().required().label('Sex'),
	sire: yup.string().required().label('Horse sire'),
	dam: yup.string().required().label('Horse dime'),
	dateOfBirth: yup.object().required().label('Date of Birth'),
	dateOfAuction: yup.string().required().label('Auction'),
	venue: yup.string().label('Venue'),
	startTime: yup.object().required().label('Start time for auction'),
	endTime: yup.object().required().label('End time for auction'),
	imagesFiles: yup.array().min(1, 'Please select atleast 1 image'),
});

const initialValues2 = {
	auctioneer: '',
	breed: '',
	location: '',
	color: '',
	sex: '',
	sire: '',
	dam: '',
	dateOfBirth: null,
	dateOfAuction: null,
	venue: '',
	startTime: null,
	endTime: null,
	imagesFiles: [],
};
