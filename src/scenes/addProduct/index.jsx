import {
	Alert,
	Box,
	Button,
	FormControl,
	FormControlLabel,
	FormLabel,
	Input,
	Radio,
	RadioGroup,
	Snackbar,
	Tab,
	TextField,
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
import Header from '../../components/Header';
import { useState } from 'react';
import { MuiFileInput } from 'mui-file-input';

export default () => {
	const isNonMobile = useMediaQuery('(min-width:600px)');

	return (
		<Box m="20px">
			<Header title="CREATE AUCTION" subtitle="Create a New Auction" />
			<TabViews isNonMobile={isNonMobile} />
		</Box>
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
			<Snackbar open={true} autoHideDuration={2000} onClose={() => {}}>
				<Alert onClose={() => {}} severity="success" sx={{ width: '100%' }}>
					This is a success message!
				</Alert>
			</Snackbar>

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
				<TabPanel value="2">Highest Bid Auction</TabPanel>
			</TabContext>
		</>
	);
};

const FixedPriceAuction = ({ isNonMobile }) => {
	const handleFormSubmit = async (values) => {
		console.log(values);
		// uploadToCloudinary(values)
	};

	const uploadToCloudinary = async (values) => {
		const imageUrls = [];
		for (const file of values.imagesFiles) {
			const formData = new FormData();
			formData.append('file', file);
			formData.append('upload_preset', 'hgdunol9');

			try {
				const response = await fetch(
					'https://api.cloudinary.com/v1_1/dhhmnhd8c/upload/',
					{
						method: 'POST',
						body: formData,
					}
				);

				if (response.ok) {
					const data = await response.json();
					imageUrls.push(data.secure_url);
				} else console.error('Image upload failed.');
			} catch (error) {
				console.error('Error uploading image:', error);
			}
		}

		return imageUrls;
	};

	return (
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
							label="Horse Title"
							onBlur={handleBlur}
							onChange={handleChange}
							value={values.horseTitle}
							name="horseTitle"
							error={!!touched.horseTitle && !!errors.horseTitle}
							helperText={touched.horseTitle && errors.horseTitle}
							sx={{ gridColumn: 'span 2' }}
						/>

						<TextField
							fullWidth
							variant="outlined"
							type="text"
							inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }}
							label="Reserved Price"
							onBlur={handleBlur}
							onChange={handleChange}
							value={values.breed}
							name="reservedPrice"
							error={!!touched.reservedPrice && !!errors.reservedPrice}
							helperText={touched.reservedPrice && errors.reservedPrice}
							sx={{ gridColumn: 'span 2' }}
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
								<FormControlLabel value="bay" control={<Radio />} label="Bay" />
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
							name="venue"
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
							name="venue"
							error={!!touched.dam && !!errors.dam}
							helperText={touched.dam && errors.dam}
							sx={{ gridColumn: 'span 2' }}
						/>

						<Box sx={{ gridColumn: 'span 4' }}>
							<DatePicker
								disableFuture
								label="Date of Birth"
								format="DD/MM/YYYY"
								value={values.dateOfBirth}
								onChange={(value) => setFieldValue('dateOfBirth', value, true)}
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

						<TextField
							fullWidth
							variant="filled"
							multiline
							type="text"
							label="Description"
							onBlur={handleBlur}
							onChange={handleChange}
							value={values.breed}
							name="description"
							error={!!touched.description && !!errors.description}
							helperText={touched.description && errors.description}
							sx={{ gridColumn: 'span 2' }}
							inputProps={{
								style: {
									height: 100,
								},
							}}
						/>

						<Box sx={{ gridColumn: 'span 4' }}>
							<DatePicker
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

						<TimePicker
							label="Date of Auction"
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

						{/* <Input type="file" slotProps={{inputp:}}/> */}
						<MuiFileInput
							multiple
							placeholder="Add Images"
							error={!!touched.imagesFiles && !!errors.imagesFiles}
							helperText={touched.imagesFiles && errors.imagesFiles}
							value={values.imagesFiles}
							onChange={(value) => setFieldValue('imagesFiles', value, true)}
							inputProps={{ accept: 'image/*' }}
						/>
						{/* <input
							type="file"
							accept="image/*"
							multiple
							onChange={(e) => console.log(e.target.files)}
						/> */}
					</Box>
					<Box display="flex" justifyContent="end" mt="20px">
						<Button type="submit" color="secondary" variant="contained">
							Create New Auction
						</Button>
					</Box>
				</form>
			)}
		</Formik>
	);
};

const fixedPriceAuctionSchema = yup.object().shape({
	// horseTitle: yup.string().required().label('Horse title'),
	// breed: yup.string().required().label('Breed'),
	// sex: yup.string().required().label('Sex'),
	// color: yup.string().required().label('Color'),
	// dateOfBirth: yup.object().required().label('Date of Birth'),
	// reservedPrice: yup
	// 	.number()
	// 	.typeError('Reserved Price must specify a number')
	// 	.required()
	// 	.min(100)
	// 	.label('Reserved Price'),
	// description: yup.string().required().min(10).label('Description'),
	// dateOfAuction: yup.string().required().label('Auction'),
	// sire: yup.string().required().label('Horse sire'),
	// dam: yup.string().required().label('Horse dime'),
	// venue: yup.string().required().label('Venue'),
	// startTime: yup.object().required().label('Start time for auction'),
	imagesFiles: yup.array().min(1, 'Please select atleast 1 image'),
});
const initialValues = {
	// horseTitle: '',
	// breed: '',
	// color: '',
	// sex: '',
	// dateOfBirth: null,
	// description: '',
	// reservedPrice: '',
	// dateOfAuction: null,
	// startTime: '',
	// venue: '',
	// sire: '',
	// dam: '',
	imagesFiles: [],
};
