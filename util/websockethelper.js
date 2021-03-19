const sendToAdminVolunteerPanel = (io, type, method, data, panelID) => {
	console.log("sendAdmin method");
	io.in('admin').emit(type, method, data);

	let roomMap = io.sockets.adapter.rooms;

	let activeSockets = Array.from(io.sockets.adapter.nsp.sockets);

	let volunteerRoom = roomMap.get('volunteer');
	let panelRoom = roomMap.get('panel');

	volunteerRoom = volunteerRoom == undefined ? [] : Array.from(volunteerRoom);
	panelRoom = panelRoom == undefined ? [] : Array.from(panelRoom);

	let volSocket = activeSockets.find((item) => volunteerRoom.includes(item[0]) && item[1].panelID == panelID);
	let panelSocket = activeSockets.find((item) => panelRoom.includes(item[0]) && item[1].panelID == panelID);
	
	if (Array.isArray(panelSocket) && panelSocket.length == 2) {
		io.to(panelSocket[0]).emit(type, method, data);
	}

	if (Array.isArray(volSocket) && volSocket.length == 2) {
		delete data.feedback;
		io.to(volSocket[0]).emit(type, method, data);
	}
};

module.exports = sendToAdminVolunteerPanel;
