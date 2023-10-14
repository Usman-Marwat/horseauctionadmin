import {
	Alert,
	Backdrop,
	Box,
	Button,
	CircularProgress,
	Container,
	Snackbar,
	TextField,
	Typography,
} from '@mui/material';
import {
	DatePicker,
	TimePicker,
	renderTimeViewClock,
} from '@mui/x-date-pickers';
import { Formik } from 'formik';
import * as yup from 'yup';

import useMediaQuery from '@mui/material/useMediaQuery';
import Header from '../../components/Header';
import { useState } from 'react';
import { MuiFileInput } from 'mui-file-input';
import { useMutation } from '@tanstack/react-query';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { ArrowRight } from '@mui/icons-material';
import { uploadImagesToCloudinary } from '../../config/cloudinary';

const baseUrl = import.meta.env.VITE_REACT_APP_BASE_URL;

export default () => {
	const isNonMobile = useMediaQuery('(min-width:600px)');

	return (
		<Box m="20px">
			<Header title="CREATE EVENT" subtitle="Create a New Event" />
			<EventForm isNonMobile={isNonMobile} />
		</Box>
	);
};

const EventForm = ({ isNonMobile }) => {
	const [isSuccessSnack, setSuccessSnack] = useState(false);
	const [errorSnack, setErrorSnack] = useState(true);
	const [loading, setLoading] = useState(false);
	const navigate = useNavigate();

	const handleSnackBarClose = (event, reason) => {
		if (reason === 'clickaway') return;
		setSuccessSnack(false);
	};

	const addEvent = useMutation({
		mutationFn: (auction) =>
			axios.post(`${baseUrl}event`, auction).then((res) => res.data),
		onSuccess: (savedEvent) => {
			console.log(savedEvent);
			setSuccessSnack(true);
		},
	});

	const handleFormSubmit = async (values, { resetForm }) => {
		// return console.log(values);
		setLoading(true);
		try {
			const images = await uploadImagesToCloudinary(values.imagesFiles);
			addEvent.mutate({ ...values, images });
			// resetForm();
			setLoading(false);
		} catch (error) {
			console.log(error);
			setLoading(false);
		}
	};

	return (
		<>
			<Backdrop
				sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
				open={addEvent.isLoading || loading}
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
					<Typography>Event is successfully Created!</Typography>
					<Button
						variant="text"
						onClick={() => navigate('/events')}
						size="small"
					>
						See Events <ArrowRight />
					</Button>
				</Alert>
			</Snackbar>
			{addEvent.isError && (
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
						<Container component="main" maxWidth="md">
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
									label="Event Title"
									onBlur={handleBlur}
									onChange={handleChange}
									value={values.eventTitle}
									name="eventTitle"
									error={!!touched.eventTitle && !!errors.eventTitle}
									helperText={touched.eventTitle && errors.eventTitle}
									sx={{ gridColumn: 'span 2' }}
								/>

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

								<Box sx={{ gridColumn: 'span 2' }}>
									<DatePicker
										sx={{ width: '100%' }}
										disablePast
										label="Date of Event"
										format="DD/MM/YYYY"
										value={values.dateOfEvent}
										onChange={(value) =>
											setFieldValue('dateOfEvent', value, true)
										}
										slotProps={{
											textField: {
												variant: 'outlined',
												error: !!touched.dateOfEvent && !!errors.dateOfEvent,
												helperText: touched.dateOfEvent && errors.dateOfEvent,
												onBlur: handleBlur,
											},
										}}
									/>
								</Box>

								<TimePicker
									label="Start Time For Event"
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

								<TextField
									fullWidth
									variant="filled"
									multiline
									type="text"
									label="Description"
									onBlur={handleBlur}
									onChange={handleChange}
									value={values.description}
									name="description"
									error={!!touched.description && !!errors.description}
									helperText={touched.description && errors.description}
									sx={{ gridColumn: 'span 4 ' }}
									inputProps={{ style: { height: 100 } }}
								/>

								<MuiFileInput
									multiple
									placeholder="Add Images"
									error={!!touched.imagesFiles && !!errors.imagesFiles}
									helperText={touched.imagesFiles && errors.imagesFiles}
									value={values.imagesFiles}
									onChange={(value) =>
										setFieldValue('imagesFiles', value, true)
									}
									inputProps={{ accept: 'image/*' }}
									sx={{ gridColumn: 'span 2 ' }}
								/>
							</Box>
						</Container>
						<Box display="flex" justifyContent="end" mt="20px">
							<Button type="submit" color="secondary" variant="contained">
								Create New Event
							</Button>
						</Box>
					</form>
				)}
			</Formik>
		</>
	);
};

const fixedPriceAuctionSchema = yup.object().shape({
	eventTitle: yup.string().required().label('Event title'),
	dateOfEvent: yup.object().required().label('Date of Event'),
	description: yup.string().required().min(10).label('Description'),
	venue: yup.string().required().label('Venue'),
	startTime: yup.object().required().label('Start time for auction'),
	imagesFiles: yup.array().min(1, 'Please select atleast 1 image'),
});

const initialValues = {
	eventTitle: '',
	dateOfEvent: null,
	description: '',
	venue: '',
	startTime: null,
	imagesFiles: [],
};
