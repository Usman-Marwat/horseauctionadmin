import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

const Sellers = () => {
	const bull = (
		<Box
			component="span"
			sx={{ display: 'inline-block', mx: '2px', transform: 'scale(0.8)' }}
		>
			•
		</Box>
	);

	return (
		<Box m={2}>
			<Card sx={{ minWidth: 275 }}>
				<CardContent>
					<Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
						Horse seller
					</Typography>
					<Typography variant="h5" component="div">
						male{bull}breed{bull}color{bull}5 years
					</Typography>
					<Typography sx={{ mb: 1.5 }} color="text.secondary">
						£5000
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

			<Card sx={{ minWidth: 275, marginTop: 2 }}>
				<CardContent>
					<Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
						Horse seller
					</Typography>
					<Typography variant="h5" component="div">
						male{bull}breed{bull}color{bull}5 years
					</Typography>
					<Typography sx={{ mb: 1.5 }} color="text.secondary">
						£5000
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
		</Box>
	);
};

export default Sellers;
