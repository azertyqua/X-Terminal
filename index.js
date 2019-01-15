// --------------Variables--------------
var discord = require("discord.js"); // Core library for Discord.
var multiline = require("multiline"); // Used so we can have nice multiline /help responce.
var colors = require('colors'); // Used for multicolour terminal.
var chalk = require('chalk');
var prefix = '/';
var configFile = require("./ConfigFile.json"); // Stores Discord API token and user settings.
var fs = require('fs'); // Used so we can update configFile with user options.

var myClient = new discord.Client(); // Create a new instance of the Disord client.

var selectedChannel = configFile.selectedChannel; // Stores current / last selected channel.
var timestampEnabled = configFile.timestampEnabled; // Stores if user wants timestamps displayed.
var lastMessage; // Stores the last recieved message.
var lastMessagePM // Stores the last recieved Private Message message.
// --------------Variables-----------END

myClient.login(configFile.token); // Login to server.

myClient.on("ready", function() {
	
 var memberCount = myClient.users.size;
 var servercount = myClient.guilds.size;
 var memberNumber = myClient.users.size;
 var serverNumber = myClient.guilds.size;
 var servers = myClient.guilds.array().map(g => g.name).join(',');

console.log("--------------------------------------");
console.log('--> ' + (chalk.yellow('Bot By LarchitecT')) +' \n--> ' + (chalk.green('Connecter avec succès  ')) + ' \n--> ' + (chalk.magenta('Name Bot:              '))+ `[ ${myClient.user.tag} ]` + ' \n--> '+(chalk.magenta('Le préfix actuel:      ')) +  `[ ${prefix} ]`  + '\n--> '+ (chalk.magenta('Nombre d\'utilisateurs: ')) + `[ ${myClient.users.size} ]` + '\n--> '+ (chalk.magenta('Nombre salon:          ')) + `[ ${myClient.channels.size} ]` + '\n--> '+ (chalk.magenta('Nombre de serveurs:    ')) + `[ ${myClient.guilds.size} ]`);
console.log("--------------------------------------");
console.log('--> ' + (chalk.green('Prèt !')));
console.log('______________________________________');
	//myClient.user.setGame("Discord-Terminal");
});

myClient.on("disconnected", function() {
	var timestamp = new Date();
	console.log((timestamp) + " Perte de connexion aux serveurs DiscordApp.");
	// Add reconnect script here at some point. Use timeout and a function for login.
});

myClient.on("message", function(msg) { // Anytime we receive a new message check what channel and server.
	if (msg.author.id != myClient.user.id){ // Prevent bot triggering itself.
		if (msg.channel.type === "dm") { // If we recieve a Priave Message.
			if (timestampEnabled === "true") {
				var timestamp = new Date().toLocaleTimeString(); // Time only.
				console.log(colors.bgMagenta((timestamp) + " - " + msg.author.username + ": " + msg));
			}
			else {
				console.log(colors.bgMagenta(msg.author.username + ": " + msg));
			}
			lastMessagePM = msg;
			for (var url in msg.attachments.array()) { // If we get a image process image URL and print URL to terminal.
				console.log(msg.attachments.array()[url].url);
			}
		}
		else if (msg.channel.id === selectedChannel) { // If we recieve a Channel Message.
			if (timestampEnabled === "true") {
				var timestamp = new Date().toLocaleTimeString(); // Time only.
				console.log(colors.bgBlue((timestamp) + " - " + msg.author.username + ": " + msg));
			}
			else{
				console.log(colors.bgBlue(msg.author.username + ": " + msg));
			}
			lastMessage = msg;
			for (var url in msg.attachments.array()) { // If we get a image process image URL and print URL to terminal.
				console.log(msg.attachments.array()[url].url);
			}
		}
		else {
			// Maybe print something if we missed messages because we are not in that channel. Add a counter and tab bar.
		}
	}
});

// ------------Inputs-From-Terminal-Interface------------
process.stdin.setEncoding('utf8');

process.stdin.on('data', function (terminalInputRaw) {

	var terminalInput = terminalInputRaw.replace(/(\r\n|\n|\r|\t)/gm,""); // Trim the \r\n off the end of string.
	var terminalInputPrefix = terminalInput.split(" ", 1).toString(); // Take first word delimited by space.
	var terminalInputSuffix = terminalInput.substring(terminalInputPrefix.length + 1); // Takes anything after the first word.

	if (terminalInput === '/n' || terminalInput === '/users') {
		console.log("Nombre d'utilisateurs : " + myClient.users.size);
		var list = myClient.users.array().map(u => ((chalk.green(u.username)) + '\n' + (chalk.yellow(u.id)) + '\n' + ((chalk.magenta(u.presence.status))) + '\n' + '══════════════════'));
		console.log("Utilisateurs disponibles : " + (list).join('\n'));
	}
	else if (terminalInput === '/commands' || terminalInput === '/help') {
		console.log(commands);
	}
	else if (terminalInput === '/about') {
		console.log(about);
	}
	else if (terminalInput === '/invite') {
		const request = require('request');
		request('https://discord.gg/eB97Pz5', { json: true }, (err, res, body) => {
  if (err) { return console.log(err); }

})
	}
	else if (terminalInput === '/quit') {
		console.log("Quitting Discord-Terminal");
		process.exit();
	}
	else if (terminalInput === '/channels') {
		console.log("Number of Available Channels: " + myClient.channels.size);
		var list = myClient.channels.array().map(c => ((chalk.green(c.name)) + '\n' + (chalk.yellow(c.id)) + '\n' + ((chalk.magenta(c.type))) + '\n' + '══════════════════'));
		console.log("Available Channels: " + list);
	}
	else if (terminalInput === '/servers') {
		console.log("Number of Available Servers: " + myClient.guilds.size);
		var list = myClient.guilds.array().map(g => ((chalk.green(g.name)) + `\n` + (chalk.yellow(g.id)) + `\n` + `══════════════════`+`\n`));
		console.log("Available Servers: " + list);
	}
	else if (terminalInputPrefix === '/join') {
		selectedChannel = terminalInputSuffix;
		configFile.selectedChannel = terminalInputSuffix;
		fs.writeFileSync("./ConfigFile.json", JSON.stringify(configFile, null, "	"));
		console.log((chalk.magenta("Joined channel: ")) + selectedChannel)
	}
	else if (terminalInputPrefix === '/timestamp') {
		timestampEnabled = "true";
		configFile.timestampEnabled = "true";
		fs.writeFileSync("./ConfigFile.json", JSON.stringify(configFile, null, "	"));
		console.log("Enabled Timestamps")
	}
	else if (terminalInputPrefix === '/notimestamp') {
		timestampEnabled = "false";
		configFile.timestampEnabled = "false";
		fs.writeFileSync("./ConfigFile.json", JSON.stringify(configFile, null, "	"));
		console.log("Disabled Timestamps")
	}
	else if (terminalInputPrefix === '/nick') {
		var newNickname = terminalInputSuffix;
		myClient.user.setUsername(newNickname);
		console.log("Changed Nick to: " + newNickname);
	}
	else if (terminalInputPrefix === '/setavatar') {
		var newAvatarLocation = terminalInputSuffix;
		myClient.user.setAvatar(newAvatarLocation);
		console.log("Changed Avatar");
	}
	else if (terminalInputPrefix === '/setgame') {
		var newGameStatus = terminalInputSuffix;
		myClient.user.setGame(newGameStatus);
		console.log("Changed Playing to: " + newGameStatus);
	}
	else if (terminalInputPrefix === '/sendfile') {
		var fileLocation = terminalInputSuffix;
		myClient.channels.get(selectedChannel).sendFile(fileLocation);
		console.log("Attachment Sent");
	}
	else if (terminalInput === '/online') {
		myClient.user.setStatus("online");
	}
	else if (terminalInput === '/idle') {
		myClient.user.setStatus("idle");
	}
	else if (terminalInput === '/invisible') {
		myClient.user.setStatus("invisible");
	}
	else if (terminalInput === '/dnd') {
		myClient.user.setStatus("dnd");
	}
	else if (terminalInputPrefix === '/reply') {
		// Send a reply to last channel message.
		myClient.channels.get(selectedChannel).send(lastMessage.author.toString() + " " + terminalInputSuffix);
	}
	else if (terminalInputPrefix === '/replypm') {
		// Send a reply to last Private Message.
		lastMessagePM.author.send(terminalInputSuffix);
	}
	else if (terminalInputPrefix === '/pm') {
		// Send a Private Message to a user ID.
		//myClient.fetchUser(terminalInputSuffix.split(" ", 1)).then(user => {user.send("TODO")});
	}
	else if (terminalInputPrefix === '/me') {
		// We have to add /me as it would otherwise be blocked by "/" filter as it looks like a command.
		myClient.channels.get(selectedChannel).send("*" + terminalInputSuffix + "*");
	}
	else if (terminalInputPrefix === '/tableflip') {
		// Adding tableflip. This is a desktop client command.
		myClient.channels.get(selectedChannel).send("(╯°□°）╯︵ ┻━┻");
	}
	else if (terminalInputPrefix === '/tts') {
		// Send TTS message.
		myClient.channels.get(selectedChannel).send(terminalInputSuffix, {tts:true});
	}
	else if (terminalInputPrefix === '/clear') {
		// Clears the terminal. Tested on Linux & Windows.
		console.log('\033[2J');
	}
	else if (terminalInput[0] != '/' && terminalInput !== "") { // Si nous n'utilisons pas de commande ou envoyons un message vierge.
		//console.log("treating as message");
		myClient.channels.get(selectedChannel).send(terminalInput);
	}
});
// ------------Inputs-From-Terminal-Interface---------END

var commands = multiline(function() {/*
Help Commands:------------------------------------------
/n                Répertorie les utilisateurs en ligne dans le canal actuel.
/channels         Liste des canaux disponibles.
/join <channelID> Changement de canal.
/timestamp        Active l'horodatage des msgs.
/notimestamp      Désactive l'horodatage des msgs.
/nick <nickname>  Change votre nom d'utilisateur.
/tts <message>    Envoie un message tts.
/reply <message>  Mentions du dernier expéditeur.
/replypm          Réponses au dernier PM.
/clear            Efface la fenêtre du terminal.
/tableflip        Envoie le flip de table.
/online           Définit le statut en ligne.
/idle             Définit l'état inactif / absent.
/invisible        Définit le statut invisible.
/dnd              Définit le statut ne pas déranger.
/quit             Quits Discord-Terminal.
/setavatar <file> Définit l'avatar.
/setgame <game>   Modifie le statut du Game.
/sendfile <file>  Envoie un fichier.
--------------------------------------------------------
*/});

var about = multiline(function() {/*
About:-----------------------------------------------
Discord-Terminal By: LarchitecT
Version: 2.0.0
Licence: GNU GPL Version 3
-----------------------------------------------------
*/});
/*
myClient.on('message', message => {
const Discord = require("discord.js");
	
if (message.content){
  

    
      //if (message.author.bot) return;
          
           const embed = new Discord.RichEmbed()
	  .setTitle(`${message.channel.id || 'PRIVE'}`)
      .addField('Utilisateur:', `${message.author.username}`, true)
      //.addBlankField(true)
      .addField('Serveur:', `${message.guild ? message.guild.name : '(DM)'}`, true)
      //.addBlankField(true)
      .addField('Salon:', `${message.channel.name || 'PRIVE'}`)
      .addBlankField(true)
      .addField('Message:', ` \`\`\`fix\n${message.cleanContent}\n\`\`\``)
      .addBlankField(true)
      .setFooter(`${message.author.id}`, `${message.author.avatarURL}`)
      .setTimestamp()
      
 myClient.channels.get('470959910247464960').send({embed});
 
 console.log(`${(chalk.green(`${message.author.username}`))} (${message.author.id || 'PRIVE'})` +' | Server '+ (chalk.magenta(`${message.guild ? message.guild.name : '(DM)'}`)) + ` (${message.guild ? message.guild.id : 'PRIVE'}) | Salon: # ` + (chalk.magenta(`${message.channel.name || 'PRIVE'} `))+` (${message.channel.id || 'PRIVE'}): ` + '\n' + (chalk.cyan(` ${message.cleanContent} `))+ '\n--------------------------------------') 

 
   }
   
   
});   
*/
/*
myClient.on('message', async message => {
let args = message.content.split(" ").slice(1);
	
  if (message.content === `/mess`){
	  if (args.length < 2 || !(parseInt(args[0]) < 9223372036854775807)) {

      return message.channel.send('TEST');
    }
	


  try {

	
	message.channel.send({
      embed: {
        //color: Bastion.colors.BLUE,
		title: `Message envoyer sur : ${message.guild.name} salon : ${message.channel.name}`,
        description: `\`\`\`fix\n${args.slice(1).join(' ')}\`\`\``
      }
    })

  
      let channel = myClient.channels.get(args[0]);
      if (channel) {
        channel.send({
          embed: {
            //color: Bastion.colors.BLUE,
            description: `\`\`\`fix\n${args.slice(1).join(' ')}\`\`\``
          }
        })
      }

    
  }
  catch (e) {
    myClient.log.error(e);
  }
};

   
});
*/