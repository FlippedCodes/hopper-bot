// init Discord
const { Client, Intents, Collection } = require('discord.js');
// init file system
const fs = require('fs');
// init command builder
const { SlashCommandBuilder } = require('@discordjs/builders');
// setting essential global values; additional global values are set in the globalfunc.js file
// init Discord client
global.client = new Client({
  disableEveryone: true,
  intents: [
    Intents.FLAGS.GUILD_MESSAGES,
    Intents.FLAGS.GUILDS,
    Intents.FLAGS.GUILD_MEMBERS,
    Intents.FLAGS.DIRECT_MESSAGES,
    Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
  ],
});
// init config
global.config = require('./config.json');
global.config.package = require('./package.json');

global.DEBUG = process.env.NODE_ENV === 'development';

global.CmdBuilder = SlashCommandBuilder;

// global.LOG = (msg) => console.log(`[${SHARDID}] ${msg}`);

global.ERR = (err) => {
  console.error('ERROR:', err);
  if (DEBUG) return;
  const { MessageEmbed } = require('discord.js');
  const embed = new MessageEmbed()
    .setAuthor({ name: `Error: '${err.message}'` })
    .setDescription(`STACKTRACE:\n\`\`\`${err.stack.slice(0, 4000)}\`\`\``)
    .setColor('RED');
  client.channels.cache.get(config.commands.DoBchecking.logChannelID).send({ embeds: [embed] });
  return;
};

// creating collections and sets
client.commands = new Collection();
client.functions = new Collection();

// anouncing debug mode
if (DEBUG) console.log(`[${config.package.name}] Bot is on Debug-Mode. Some functions are not going to be loaded.`);

(async () => {
  // startup functions in order
  // const startupQueue = new PQueue({ concurrency: 1 });
  const files = await fs.readdirSync('./functions/STARTUP');
  files.forEach(async (FCN) => {
    if (!FCN.endsWith('.js')) return;
    const INIT = require(`./functions/STARTUP/${FCN}`);
    await INIT.run(fs);
  });

  // When done: Login the bot
  await client.login(process.env.token_discord);
})();

client.on('ready', async () => {
  // confirm user logged in
  console.log(`[${config.package.name}] Logged in as "${client.user.tag}"!`);

  // run setup functions
  config.setup.setupFunctions.forEach((FCN) => {
    client.functions.get(FCN).run();
  });
});

client.on('messageCreate', (message) => client.functions.get('EVENT_messageCreate').run(message));

// itneraction is triggered (command, autocomplete, etc.)
client.on('interactionCreate', (interaction) => client.functions.get('EVENT_interactionCreate').run(interaction));

// logging errors and warns
client.on('error', (ERR));
client.on('warn', (ERR));
process.on('uncaughtException', (ERR));
