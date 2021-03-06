const restify = require('restify');
const builder = require('botbuilder');
const formflowbotbuilder = require('formflowbotbuilder');


// SETUP
const server = restify.createServer();
server.listen(process.env.port || process.env.PORT || 3978, () => {
   console.log('%s listening to %s', server.name, server.url); 
});

const connector = new builder.ChatConnector({
    appId: process.env.MICROSOFT_APP_ID,
    appPassword: process.env.MICROSOFT_APP_PASSWORD
});

const bot = new builder.UniversalBot(connector);
bot.set('storage', new builder.MemoryBotStorage());         
server.post('/api/messages', connector.listen());

// dialog
const myDialogName = 'getFields';

//formflowbotbuilder.executeFormFlow('questions.json', bot, myDialogName).then()
formflowbotbuilder.executeFormFlow('questions.json', bot, myDialogName, (err, responses) => {
    if (err)
        return console.log(err);
    bot.dialog('/', [
        (session) => {
        session.beginDialog(myDialogName);
        },
        (session, results) => {
            const questao = "Está correto?\n"
                            + `* Nome: ${responses.firstname} \n`
                            + `* Lingua: ${responses.lingua}*\n`
                            + `* Email: ${responses.email}* \n`
                            + `* url: ${responses.url}`;
            session.send(questao);
        }]);
    
  });
  