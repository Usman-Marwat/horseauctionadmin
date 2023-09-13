import React, { useEffect, useState } from 'react';
import {
	Box,
	Card,
	CardActions,
	CardContent,
	Collapse,
	Button,
	Typography,
	Rating,
	useTheme,
	useMediaQuery,
	TextField,
	Autocomplete,
	Chip,
	CircularProgress,
	Skeleton,
} from '@mui/material';
import { AddCircle, DeleteOutline } from '@mui/icons-material';
import EditIcon from '@mui/icons-material/Edit';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import IosShareIcon from '@mui/icons-material/IosShare';
import { Link, useNavigate } from 'react-router-dom';
import _ from 'lodash';
import axios from 'axios';

import Header from '../../components/Header';
import FlexBetween from '../../components/FlexBetween';
import ImageSlider from '../../components/ImageSlider';
import { useQuery } from '@tanstack/react-query';
import useBidProducts from '../../hooks/useBidProducts';

const Products = () => {
	const theme = useTheme();
	const isNonMobile = useMediaQuery('(min-width: 1000px)');
	const [selected, setSelected] = useState();

	const { data, isLoading } = useQuery({
		queryKey: ['products'],
		queryFn: () =>
			axios
				.get('https://erin-impossible-donkey.cyclic.app/client/products')
				.then((res) => res.data),
	});

	// const { data,isLoading,error} = useBidProducts();

	return (
		<Box m="1.5rem 2.5rem">
			<Header title="Auctions" su btitle="See your list of Bids" />
			<Box sx={{ marginTop: 1 }}>
				<Link to={'/addProduct'} style={{ textDecoration: 'none' }}>
					<Button type="submit" color="secondary" variant="contained">
						<Typography mr="0.7rem">Create Auction</Typography>{' '}
						<AddCircle color="white" />
					</Button>
				</Link>
			</Box>

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
						<Product
							key={product._id}
							item={product}
							onSelect={(item) => setSelected(item)}
						/>
					))}
				</Box>
			)}
		</Box>
	);
};

const Product = ({ item, onSelect }) => {
	const theme = useTheme();
	const [isExpanded, setIsExpanded] = useState(false);
	const navigate = useNavigate();

	const handleDelete = (id) => {
		console.log();
	};

	return (
		<Card
			sx={{
				backgroundImage: 'none',
				backgroundColor: theme.palette.background.alt,
				borderRadius: '0.55rem',
			}}
		>
			<CardContent>
				<ImageSlider />

				<Typography variant="h5" component="div">
					{item.name}
				</Typography>
				<Typography sx={{ mb: '1.5rem' }} color={theme.palette.secondary[400]}>
					${item.price}
				</Typography>
				<Rating value={item.rating} readOnly />

				<Typography variant="body2">{item.description}</Typography>
			</CardContent>
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
					<Typography>
						Lorem ipsum dolor sit amet consectetur adipisicing elit. Quidem vero
						sunt, labore omnis expedita harum iure architecto fugit consequuntur
						quam inventore adipisci. Nesciunt, eaque dolor, voluptas inventore
						dolorem ipsum praesentium minima dicta, laboriosam dolore aliquam
						esse illo sint provident illum autem ab quisquam aspernatur.
					</Typography>
				</CardContent>
			</Collapse>
		</Card>
	);
};

export default Products;

const styles = {
	button: {
		width: 20,
		height: 60,
		borderRadius: '50%',
	},
	couponBox: {
		marginTop: 3,
		marginBottom: 7,
		display: 'flex',
	},
};
