const planets = require('../datasets/planets.json');
const fs = require('fs');
const path = require('path');

const fetchAll = async (req, res) => {
	let allPlanets = {
		staus: 200,
		stausCode: 200,
		data: {
			planetsList: planets.planets,
		}
	};
	res.send(allPlanets);
}

const addFavourite = async (req, res) => {
	let userId = req.body.data.userId;
	let addFavs = req.body.data.favs;
	let data = {};
	addFavs.sort((a, b) => {return a - b});
	// Read all user favs data
	let rawData = fs.readFileSync(path.resolve(__dirname, '../datasets/fav.txt'));
	let favsData = JSON.parse(rawData);
	// console.log(favsData);
	// Adding favs to existing user
	let flag = false;
	for (var i = 0; i < favsData.length; i++) {
		if (favsData[i].userId === userId) {
			flag = true;
			let prev = favsData[i].favs;
			// favsData[i].favs = prev.concat(addFavs);
			addFavs.forEach( (pid) => {
				if (prev.indexOf(pid) == -1) { prev.push(pid); }
			});
			prev.sort((a, b) => {return a - b});
			favsData[i].favs = prev;
			data = {
				userId: userId,
				favs: favsData[i].favs
			}
			break;
		}
	}
	if(!flag) {
		// Adding new user and favs
		let updateData = {
			userId: userId,
			favs: addFavs
		};
		favsData.push(updateData);
		data = updateData;
	}
	
	fs.writeFileSync(path.resolve(__dirname, '../datasets/fav.txt'), JSON.stringify(favsData));
	res.send({
		status: 200,
		statusCode: 200,
		data: data
	});
}

const fetchFavourite = async (req, res) => {
	let userId = req.body.data.userId;
	let rawData = fs.readFileSync(path.resolve(__dirname, '../datasets/fav.txt'));
	let favsData = JSON.parse(rawData);
	// console.log(favsData);
	let flag = false;
	let data = {};
	for (var i = 0; i < favsData.length; i++) {
		if (favsData[i].userId === userId) {
			data = {
				userId: userId,
				favs: favsData[i].favs
			}
			flag = true;
			break;
		}
	}
	if (flag) {
		res.send({
			status: 200,
			statusCode: 200,
			data: data
		});
	} else {
		res.send({
			status: "User not found",
			statusCode: 400,
			data: data
		});
	}
}

module.exports = {
	fetchAll,
	addFavourite,
	fetchFavourite,
}