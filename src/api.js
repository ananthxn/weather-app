export const geoAPIurl = 'https://wft-geo-db.p.rapidapi.com/v1/geo';

export const geoAPIoptions = {
	method: 'GET',
	headers: {
		'x-rapidapi-key': '80ab6ba957msh077f0c882f8960bp144ef9jsna4ab5a2ce84b',
		'x-rapidapi-host': 'wft-geo-db.p.rapidapi.com'
	}
};

// try {
// 	const response = await fetch(geoAPIurl, geoAPIoptions);
// 	const result = await response.text();
// 	console.log(result);
// } catch (error) {
// 	console.error(error);
// }