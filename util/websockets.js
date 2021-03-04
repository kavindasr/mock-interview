class WebSockets {
    users = [];
    connection(client) {
      console.log(client.id);
      client.on("subscribe", (room,panelID = [-1]) => {
        client.join(room);
        if(panelID[0] != -1){
          client.panelID = panelID
        }
      });
      client.on("unsubscribe", (room) => {
        client.leave(room);
      });
    }
}
  
exports.default =  new WebSockets();