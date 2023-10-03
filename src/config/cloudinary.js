const cloudName = import.meta.env.VITE_CLOUD_NAME;
const cloudPreset = import.meta.env.VITE_PRESET;

export const uploadImagesToCloudinary = async (imagesFiles) => {
	const imageUrls = [];

	for (const file of imagesFiles) {
		const formData = new FormData();
		formData.append('file', file);
		formData.append('upload_preset', cloudPreset);

		try {
			const response = await fetch(
				`https://api.cloudinary.com/v1_1/${cloudName}/upload/`,
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
