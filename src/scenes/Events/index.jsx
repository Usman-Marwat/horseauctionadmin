import React, { useState } from 'react';
import { Box, Button, useTheme, useMediaQuery, Skeleton } from '@mui/material';
import { AddCircle } from '@mui/icons-material';
import { Link, useNavigate } from 'react-router-dom';
import _ from 'lodash';
import axios from 'axios';
import { styled } from '@mui/material/styles';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Collapse from '@mui/material/Collapse';
import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import { red } from '@mui/material/colors';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ShareIcon from '@mui/icons-material/Share';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import MoreVertIcon from '@mui/icons-material/MoreVert';

import Header from '../../components/Header';
import ImageSlider from '../../components/ImageSlider';
import { useQuery } from '@tanstack/react-query';

const baseUrl = import.meta.env.VITE_REACT_APP_BASE_URL;

export default () => {
	const theme = useTheme();
	const isNonMobile = useMediaQuery('(min-width: 1000px)');
	const [selected, setSelected] = useState();

	const { data, isLoading } = useQuery({
		queryKey: ['events'],
		queryFn: () => axios.get(`${baseUrl}event`).then((res) => res.data),
	});

	return (
		<Box m="1.5rem 2.5rem">
			<Header title="Events" subtitle="See your list of Events" />
			<Box sx={{ marginTop: 1 }}>
				<Link to={'/addEvent'} style={{ textDecoration: 'none' }}>
					<Button type="submit" color="secondary" variant="contained">
						<Typography color="white" mr="0.7rem">
							Create Event
						</Typography>
						<AddCircle />
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
				<Grid container spacing={4}>
					{data.map((event) => (
						<Grid key={event._id} item xs={12} md={6} lg={3}>
							<RecipeReviewCard event={event} />
						</Grid>
					))}
				</Grid>
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
				<Typography sx={{ mb: '1.5rem' }} color={theme.palette.secondary[400]}>
					Start Time:
					<Typography variant="body2">
						{new Date(item.startTime).toString()}
					</Typography>
				</Typography>

				{item.endTime && (
					<Typography
						sx={{ mb: '1.5rem' }}
						color={theme.palette.secondary[400]}
					>
						End Time:
						<Typography variant="body2">
							{new Date(item.endTime).toString()}
						</Typography>
					</Typography>
				)}
				{/* <Rating value={item.rating} readOnly /> */}

				<Typography variant="body2">Breed: {item.breed}</Typography>
				<Typography variant="body2">Color: {item.color}</Typography>
				<Typography variant="body2">Sex: {item.sex}</Typography>
				<Typography variant="body2">Start Time: {item.startTime}</Typography>
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
					<Typography>{item.description}</Typography>
				</CardContent>
			</Collapse>
		</Card>
	);
};

function RecipeReviewCard({ event }) {
	const [expanded, setExpanded] = React.useState(false);

	const ExpandMore = styled((props) => {
		const { expand, ...other } = props;
		return <IconButton {...other} />;
	})(({ theme, expand }) => ({
		transform: !expand ? 'rotate(0deg)' : 'rotate(180deg)',
		marginLeft: 'auto',
		transition: theme.transitions.create('transform', {
			duration: theme.transitions.duration.shortest,
		}),
	}));

	return (
		<Card sx={{ maxWidth: 345 }}>
			<CardHeader
				avatar={
					<Avatar sx={{ bgcolor: red[700] }} aria-label="title">
						{event.eventTitle[0]}
					</Avatar>
				}
				action={
					<IconButton aria-label="settings">
						<MoreVertIcon />
					</IconButton>
				}
				title={event.eventTitle}
				subheader={new Date(event.dateOfEvent).toDateString()}
			/>
			<CardMedia
				component="img"
				height="194"
				image={event.images[0]}
				alt="Auction image"
			/>
			<CardContent>
				<Typography variant="body2" color="text.secondary">
					{event.description}
				</Typography>
			</CardContent>
			<CardActions disableSpacing>
				<IconButton aria-label="add to favorites">
					<FavoriteIcon />
				</IconButton>
				<IconButton aria-label="share">
					<ShareIcon />
				</IconButton>
				<ExpandMore
					expand={expanded}
					onClick={() => setExpanded(!expanded)}
					aria-expanded={expanded}
					aria-label="show more"
				>
					<ExpandMoreIcon />
				</ExpandMore>
			</CardActions>
			<Collapse in={expanded} timeout="auto" unmountOnExit>
				<CardContent>
					<Typography paragraph>Method:</Typography>
					<Typography paragraph>
						Heat 1/2 cup of the broth in a pot until simmering, add saffron and
						set aside for 10 minutes.
					</Typography>
					<Typography paragraph>
						Heat oil in a (14- to 16-inch) paella pan or a large, deep skillet
						over medium-high heat. Add chicken, shrimp and chorizo, and cook,
						stirring occasionally until lightly browned, 6 to 8 minutes.
						Transfer shrimp to a large plate and set aside, leaving chicken and
						chorizo in the pan. Add pimentón, bay leaves, garlic, tomatoes,
						onion, salt and pepper, and cook, stirring often until thickened and
						fragrant, about 10 minutes. Add saffron broth and remaining 4 1/2
						cups chicken broth; bring to a boil.
					</Typography>
					<Typography paragraph>
						Add rice and stir very gently to distribute. Top with artichokes and
						peppers, and cook without stirring, until most of the liquid is
						absorbed, 15 to 18 minutes. Reduce heat to medium-low, add reserved
						shrimp and mussels, tucking them down into the rice, and cook again
						without stirring, until mussels have opened and rice is just tender,
						5 to 7 minutes more. (Discard any mussels that don&apos;t open.)
					</Typography>
					<Typography>
						Set aside off of the heat to let rest for 10 minutes, and then
						serve.
					</Typography>
				</CardContent>
			</Collapse>
		</Card>
	);
}
