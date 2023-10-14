import { AddCircle, AddCircleOutlineTwoTone } from '@mui/icons-material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { Box, Button, Skeleton, useMediaQuery } from '@mui/material';
import Avatar from '@mui/material/Avatar';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import CardMedia from '@mui/material/CardMedia';
import Collapse from '@mui/material/Collapse';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import { red } from '@mui/material/colors';
import { styled } from '@mui/material/styles';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

import Header from '../../components/Header';

const baseUrl = import.meta.env.VITE_REACT_APP_BASE_URL;

export default () => {
	const isNonMobile = useMediaQuery('(min-width: 1000px)');

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
				<Grid container spacing={4} marginTop={1}>
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

function RecipeReviewCard({ event }) {
	const [expanded, setExpanded] = React.useState(false);
	const navigate = useNavigate();

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
				<IconButton
					aria-label="share"
					onClick={() => navigate(`/products/${event._id}`)}
				>
					<AddCircleOutlineTwoTone />
				</IconButton>
				<Typography color="ButtonText">Add Auction</Typography>
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
					</Typography>
				</CardContent>
			</Collapse>
		</Card>
	);
}
