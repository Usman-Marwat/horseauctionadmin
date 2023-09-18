import React, { useEffect, useState } from 'react';
import {
	Box,
	Card,
	CardActions,
	CardContent,
	Collapse,
	Button,
	Typography,
	useTheme,
	useMediaQuery,
	Skeleton,
	Badge,
	Grid,
	Divider,
	Tab,
} from '@mui/material';
import { AddCircle } from '@mui/icons-material';
import { Link } from 'react-router-dom';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import _ from 'lodash';
import axios from 'axios';

import Header from '../components/Header';
import ImageSlider from '../components/ImageSlider';
import { useQuery } from '@tanstack/react-query';
import Navbar from './components/Navbar/Navbar';

import bidImage from '../assets/bid2.png';
import { TabContext, TabList, TabPanel } from '@mui/lab';

const baseUrl = import.meta.env.VITE_REACT_APP_BASE_URL;
// const baseUrl = 'https://erin-impossible-donkey.cyclic.app/';

export default () => {
	return (
		<>
			<Navbar />
			<Header title="Auctions Available" su btitle="See your list of Bids" />
			<Box p="1.5rem 2.5rem" paddingTop={'50px'}>
				<TabViews />
			</Box>
		</>
	);
};

const TabViews = () => {
	const isNonMobile = useMediaQuery('(min-width:600px)');
	const [value, setValue] = useState('1');

	const handleChange = (e) => {
		switch (e.target.textContent) {
			case 'Fixed Price Auctions':
				setValue('1');
				break;
			case 'Realtime Auctions':
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
						<Tab label="Fixed Price Auctions" value="1" />
						<Tab label="Realtime Auctions" value="2" />
					</TabList>
				</Box>
				<TabPanel value="1">
					<FixedAuctions />
				</TabPanel>
				<TabPanel value="2">
					<RealtimeAuctions />
				</TabPanel>
			</TabContext>
		</>
	);
};

const FixedAuctions = () => {
	const isNonMobile = useMediaQuery('(min-width: 1000px)');

	const { data, isLoading } = useQuery({
		queryKey: ['fixed'],
		queryFn: () =>
			axios
				.get(`${baseUrl}auction`, { params: { type: 'Fixed' } })
				.then((res) => res.data),
	});

	return (
		<>
			<Box>
				<Box sx={{ marginTop: 1 }}></Box>

				{isLoading && (
					<Box
						mt="20px"
						display="grid"
						gridTemplateColumns="repeat(4, minmax(0, 1fr))"
						justifyContent="space-between"
						rowGap="20px"
						columnGap="1.33%"
						sx={{
							'& > div': { gridColumn: isNonMobile ? undefined : 'span 4' },
						}}
					>
						{[...Array(10).fill(1)].map((_, i) => (
							<Box key={i} display="flex" flexDirection="column" gap={1}>
								<Skeleton variant="rounded" height={200} />
								<Skeleton width="90%" />
								<Skeleton width="50%" />
								<Skeleton width="70%" />
								<Skeleton width="80%" />
								<Skeleton width="25%" height={45} />
							</Box>
						))}
					</Box>
				)}

				{(data || !isLoading) && (
					<Box
						mt="20px"
						display="grid"
						gridTemplateColumns="repeat(4, minmax(0, 1fr))"
						justifyContent="space-between"
						rowGap="20px"
						columnGap="1.33%"
						sx={{
							'& > div': { gridColumn: isNonMobile ? undefined : 'span 4' },
						}}
					>
						{data.map((product) => (
							<Product key={product._id} item={product} />
						))}
					</Box>
				)}
			</Box>
		</>
	);
};

const RealtimeAuctions = () => {
	const isNonMobile = useMediaQuery('(min-width: 1000px)');

	const { data, isLoading } = useQuery({
		queryKey: ['realtime'],
		queryFn: () =>
			axios
				.get(`${baseUrl}auction`, { params: { type: 'Realtime' } })
				.then((res) => res.data),
		cacheTime: 0,
	});

	return (
		<>
			<Box>
				<Box sx={{ marginTop: 1 }}></Box>

				{isLoading && (
					<Box
						mt="20px"
						display="grid"
						gridTemplateColumns="repeat(4, minmax(0, 1fr))"
						justifyContent="space-between"
						rowGap="20px"
						columnGap="1.33%"
						sx={{
							'& > div': { gridColumn: isNonMobile ? undefined : 'span 4' },
						}}
					>
						{[...Array(10).fill(1)].map((_, i) => (
							<Box key={i} display="flex" flexDirection="column" gap={1}>
								<Skeleton variant="rounded" height={200} />
								<Skeleton width="90%" />
								<Skeleton width="50%" />
								<Skeleton width="70%" />
								<Skeleton width="80%" />
								<Skeleton width="25%" height={45} />
							</Box>
						))}
					</Box>
				)}

				{(data || !isLoading) && (
					<Box
						mt="20px"
						display="grid"
						gridTemplateColumns="repeat(4, minmax(0, 1fr))"
						justifyContent="space-between"
						rowGap="20px"
						columnGap="1.33%"
						sx={{
							'& > div': { gridColumn: isNonMobile ? undefined : 'span 4' },
						}}
					>
						{data.map((product) => (
							<Product key={product._id} item={product} isRealTime />
						))}
					</Box>
				)}
			</Box>
		</>
	);
};

const Product = ({ item, isRealTime }) => {
	const theme = useTheme();
	const [isExpanded, setIsExpanded] = useState(false);

	return (
		<Card
			sx={{
				backgroundImage: 'none',
				backgroundColor: theme.palette.background.alt,
				borderRadius: '0.55rem',
			}}
		>
			<CardContent>
				<ImageSlider imageUrls={item.images} />

				<Typography variant="h5" component="div">
					{item.horseTitle}
				</Typography>
				<Typography variant="h6" component="div">
					{item.type === 'Fixed' ? 'Fixed Price Auction' : 'Real Time Auction'}
				</Typography>
				<Typography sx={{ mb: '1.5rem' }} color={theme.palette.secondary[400]}>
					${item.reservedPrice}
				</Typography>

				{isRealTime ? (
					<Grid container>
						<Grid item xs>
							<Typography
								sx={{ mb: '1.5rem' }}
								color={theme.palette.secondary[400]}
							>
								Start Time:
								<Typography variant="body2">
									{new Date(item.startTime).toString()}
								</Typography>
							</Typography>
						</Grid>
						<Divider orientation="vertical" flexItem>
							<AccessTimeIcon />
						</Divider>
						<Grid item xs>
							<Typography
								sx={{ mb: '1.5rem' }}
								color={theme.palette.secondary[400]}
							>
								End Time:
								<Typography variant="body2">
									{new Date(item.endTime).toString()}
								</Typography>
							</Typography>
						</Grid>
					</Grid>
				) : (
					<Typography
						sx={{ mb: '1.5rem' }}
						color={theme.palette.secondary[400]}
					>
						Start Time:
						<Typography variant="body2">
							{new Date(item.startTime).toString()}
						</Typography>
					</Typography>
				)}

				<Typography variant="body2">Breed: {item.breed}</Typography>
				<Typography variant="body2">Color: {item.color}</Typography>
				<Typography variant="body2">Sex: {item.sex}</Typography>
				<Typography variant="body2">Start Time: {item.startTime}</Typography>
			</CardContent>

			<Box display="flex" justifyContent="flex-end" paddingRight={3}>
				<Badge badgeContent={4} color="primary" sx={{ cursor: 'pointer' }}>
					<Box component="img" src={bidImage} height={30} width={40} />
				</Badge>
			</Box>

			<CardActions>
				<Button
					variant="primary"
					size="small"
					onClick={() => setIsExpanded(!isExpanded)}
				>
					See More
				</Button>
			</CardActions>

			<Collapse
				in={isExpanded}
				timeout="auto"
				unmountOnExit
				sx={{
					color: theme.palette.neutral[300],
				}}
			>
				<CardContent>
					<Typography>{item.description}</Typography>
				</CardContent>
			</Collapse>
		</Card>
	);
};
