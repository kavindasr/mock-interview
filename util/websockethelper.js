const sendToAdminVolunteerPanel  = (io, type, method, data, panelID) => {
	
	io.in('admin').emit('interview', 'post', data);

	let roomMap = io.sockets.adapter.rooms;
	let activeSockets = Array.from(io.sockets.adapter.nsp.sockets);

	let volunteerRoom = roomMap.get('volunteer');
	let panelRoom = roomMap.get('panel');

	volunteerRoom = volunteerRoom == undefined ? [] : Array.from(volunteerRoom);
	panelRoom = panelRoom == undefined ? [] : Array.from(panelRoom);

	let volSocket = activeSockets.find((item) => volunteerRoom.includes(item[0]) && item[1].panelID[0] == panelID);
	let panelSocket = activeSockets.find((item) => panelRoom.includes(item[0]) && item[1].panelID[0] == panelID);

	if (Array.isArray(panelSocket) && panelSocket.length == 2) {
		console.log(panelSocket[0]);
		console.log(panelSocket[1].panelID);
		io.to(panelSocket[0]).emit(type, method, data);
	}

	if (Array.isArray(volSocket) && volSocket.length == 2) {
		delete data.feedback
		console.log(volSocket[0]);
		console.log(volSocket[1].panelID);
		io.to(volSocket[0]).emit(type, method, data);
	}
};

module.exports = sendToAdminVolunteerPanel;
