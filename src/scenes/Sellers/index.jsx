import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { Grid } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

const baseUrl = import.meta.env.VITE_REACT_APP_BASE_URL;

const Sellers = () => {
	const { data, isLoading } = useQuery({
		queryKey: ['auctionRequest'],
		queryFn: () =>
			axios.get(`${baseUrl}auctionRequest`).then((res) => res.data),
	});

	if (!data) return;

	return (
		<Box sx={{ width: '100%' }} p={2}>
			<Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
				{data.map((auctionRequest) => (
					<Grid item xs={12} md={6} key={auctionRequest._id}>
						<AuctionRequestCard auctionRequest={auctionRequest} />
					</Grid>
				))}
			</Grid>
		</Box>
	);
};

const AuctionRequestCard = ({ auctionRequest }) => {
	const bull = (
		<Box
			component="span"
			sx={{ display: 'inline-block', mx: '2px', transform: 'scale(0.8)' }}
		>
			•
		</Box>
	);
	return (
		<Card sx={{ minWidth: 275 }}>
			<CardContent>
				<Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
					Horse seller / Auctioneer: {auctionRequest.auctioneer}
				</Typography>
				<Typography variant="h5" component="div">
					{auctionRequest.sex.toUpperCase()}
					{bull}
					{auctionRequest.breed.toUpperCase()}
					{bull}
					{auctionRequest.color.toUpperCase()}
					{bull}5 years
				</Typography>
				<Typography sx={{ mb: 1.5 }} color="text.secondary">
					{auctionRequest.type} Auction
				</Typography>
				<Typography variant="body2">
					I am selling this horse
					<br />
					{'"Plase approve my payment and make the auction public"'}
				</Typography>
			</CardContent>
			<CardActions>
				<Button size="small">Approve?</Button>
			</CardActions>
		</Card>
	);
};

export default Sellers;
