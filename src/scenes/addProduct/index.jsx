import { Box, Button, Tab, TextField, Typography } from '@mui/material';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import { Formik } from 'formik';
import * as yup from 'yup';

import useMediaQuery from '@mui/material/useMediaQuery';
import Header from '../../components/Header';
import { useState } from 'react';
import { ArrowDropDownCircleOutlined } from '@mui/icons-material';
import {
	Accordion,
	AccordionDetails,
	AccordionSummary,
} from '../../components/MyAccordian';

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
	);
};

const FixedPriceAuction = ({ isNonMobile }) => {
	const [expanded, setExpanded] = useState('panel1');

	const handleAccordianChange = (panel) => (event, newExpanded) => {
		setExpanded(newExpanded ? panel : false);
	};

	const handleFormSubmit = (values) => {
		console.log(values);
	};

	const MainProps = ({ values, errors, touched, handleBlur, handleChange }) => (
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
				label="Horese Property 1"
				onBlur={handleBlur}
				onChange={handleChange}
				value={values.firstName}
				name="firstName"
				error={!!touched.firstName && !!errors.firstName}
				helperText={touched.firstName && errors.firstName}
				sx={{ gridColumn: 'span 2' }}
			/>
			<TextField
				fullWidth
				variant="filled"
				type="text"
				label="Horese Property 2"
				onBlur={handleBlur}
				onChange={handleChange}
				value={values.lastName}
				name="lastName"
				error={!!touched.lastName && !!errors.lastName}
				helperText={touched.lastName && errors.lastName}
				sx={{ gridColumn: 'span 2' }}
			/>
			<TextField
				fullWidth
				variant="filled"
				type="text"
				label="Horese Property 3"
				onBlur={handleBlur}
				onChange={handleChange}
				value={values.email}
				name="email"
				error={!!touched.email && !!errors.email}
				helperText={touched.email && errors.email}
				sx={{ gridColumn: 'span 4' }}
			/>
			<TextField
				fullWidth
				variant="filled"
				type="text"
				label="Horese Property 4"
				onBlur={handleBlur}
				onChange={handleChange}
				value={values.contact}
				name="contact"
				error={!!touched.contact && !!errors.contact}
				helperText={touched.contact && errors.contact}
				sx={{ gridColumn: 'span 4' }}
			/>
			<TextField
				fullWidth
				variant="filled"
				type="text"
				label="Horese Property 5"
				onBlur={handleBlur}
				onChange={handleChange}
				value={values.address1}
				name="address1"
				error={!!touched.address1 && !!errors.address1}
				helperText={touched.address1 && errors.address1}
				sx={{ gridColumn: 'span 4' }}
			/>
			<TextField
				fullWidth
				variant="filled"
				type="text"
				label="Horese Property 6"
				onBlur={handleBlur}
				onChange={handleChange}
				value={values.address2}
				name="address2"
				error={!!touched.address2 && !!errors.address2}
				helperText={touched.address2 && errors.address2}
				sx={{ gridColumn: 'span 4' }}
			/>
		</Box>
	);

	return (
		<Formik
			onSubmit={handleFormSubmit}
			initialValues={initialValues}
			validationSchema={checkoutSchema}
		>
			{({
				values,
				errors,
				touched,
				handleBlur,
				handleChange,
				handleSubmit,
			}) => (
				<form onSubmit={handleSubmit}>
					<div>
						<Accordion
							expanded={expanded === 'panel1'}
							onChange={handleAccordianChange('panel1')}
						>
							<AccordionSummary
								aria-controls="panel1d-content"
								id="panel1d-header"
							>
								<Typography>Main Horse Data</Typography>
							</AccordionSummary>
							<AccordionDetails>
								<MainProps
									values={values}
									errors={errors}
									touched={touched}
									handleBlur={handleBlur}
									handleChange={handleChange}
								/>
							</AccordionDetails>
						</Accordion>

						<Accordion
							expanded={expanded === 'panel2'}
							onChange={handleAccordianChange('panel2')}
						>
							<AccordionSummary
								aria-controls="panel2d-content"
								id="panel2d-header"
							>
								<Typography>Owner</Typography>
							</AccordionSummary>
							<AccordionDetails>
								<Typography>
									Lorem ipsum dolor sit amet, consectetur adipiscing elit.
									Suspendisse malesuada lacus ex, sit amet blandit leo lobortis
									eget. Lorem ipsum dolor sit amet, consectetur adipiscing elit.
									Suspendisse malesuada lacus ex, sit amet blandit leo lobortis
									eget.
								</Typography>
							</AccordionDetails>
						</Accordion>

						<Accordion
							expanded={expanded === 'panel3'}
							onChange={handleAccordianChange('panel3')}
						>
							<AccordionSummary
								aria-controls="panel3d-content"
								id="panel3d-header"
							>
								<Typography>Entered Horse</Typography>
							</AccordionSummary>
							<AccordionDetails>
								<Typography>
									Lorem ipsum dolor sit amet, consectetur adipiscing elit.
									Suspendisse malesuada lacus ex, sit amet blandit leo lobortis
									eget. Lorem ipsum dolor sit amet, consectetur adipiscing elit.
									Suspendisse malesuada lacus ex, sit amet blandit leo lobortis
									eget.
								</Typography>
							</AccordionDetails>
						</Accordion>

						<Accordion
							expanded={expanded === 'panel4'}
							onChange={handleAccordianChange('panel4')}
						>
							<AccordionSummary
								aria-controls="panel4d-content"
								id="panel4d-header"
							>
								<Typography>Other Options</Typography>
							</AccordionSummary>
							<AccordionDetails>
								<Typography>
									Lorem ipsum dolor sit amet, consectetur adipiscing elit.
									Suspendisse malesuada lacus ex, sit amet blandit leo lobortis
									eget. Lorem ipsum dolor sit amet, consectetur adipiscing elit.
									Suspendisse malesuada lacus ex, sit amet blandit leo lobortis
									eget.
								</Typography>
							</AccordionDetails>
						</Accordion>
					</div>

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

const phoneRegExp =
	/^((\+[1-9]{1,4}[ -]?)|(\([0-9]{2,3}\)[ -]?)|([0-9]{2,4})[ -]?)*?[0-9]{3,4}[ -]?[0-9]{3,4}$/;

const checkoutSchema = yup.object().shape({
	firstName: yup.string().required('required'),
	lastName: yup.string().required('required'),
	email: yup.string().email('invalid email').required('required'),
	contact: yup
		.string()
		.matches(phoneRegExp, 'Phone number is not valid')
		.required('required'),
	address1: yup.string().required('required'),
	address2: yup.string().required('required'),
});
const initialValues = {
	firstName: '',
	lastName: '',
	email: '',
	contact: '',
	address1: '',
	address2: '',
};
