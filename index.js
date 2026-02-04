require('dotenv').config();
const { Client, GatewayIntentBits, ChannelType } = require('discord.js');

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildVoiceStates
  ]
});

client.once('ready', () => {
  console.log(`✅ Connecté en tant que ${client.user.tag}`);
});

client.on('messageCreate', async message => {
  if (message.author.bot) return;

  // --- Commande !setup ---
  if (message.content === "!setup") {
    const guild = message.guild;

    // --- Rôle général Staff ---
    const generalStaff = [{ name: "Staff de Urgence Marseilla", color: "Purple" }];
    for (const r of generalStaff) {
      if (!guild.roles.cache.find(role => role.name === r.name)) {
        await guild.roles.create(r);
      }
    }

    // --- Tous les rôles Staff détaillés ---
    const staffRoles = [
      "Fonda", "Co-Fonda", "Responsable Serveur", "Responsable Staff", 
      "Responsable Admin", "Admin", "Admin Test", "Responsable Modérateurs", 
      "Modo", "Modo Test", "Responsable Support", "Support", "Support Test"
    ];

    for (const r of staffRoles) {
      if (!guild.roles.cache.find(role => role.name === r)) {
        await guild.roles.create({ name: r, color: "Blue" });
      }
    }

    // --- Rôles Urgence ---
    const urgenceRoles = ["🚑 SAMU", "🚒 Pompier", "👮 Police", "👤 Citoyen"];
    for (const r of urgenceRoles) {
      if (!guild.roles.cache.find(role => role.name === r)) {
        await guild.roles.create({ name: r, color: "Red" });
      }
    }

    // --- Catégorie principale ---
    let mainCat = guild.channels.cache.find(c => c.name === "🚨 URGENCE MARSEILLA" && c.type === ChannelType.GuildCategory);
    if (!mainCat) {
      mainCat = await guild.channels.create({ name: "🚨 URGENCE MARSEILLA", type: ChannelType.GuildCategory });
    }

    // --- Salons textuels ---
    const textSalons = [
      "📜-règlement", "📝-whitelist", "💬-général",
      "📢-annonces", "🎫-tickets", "📌-staff"
    ];

    for (const s of textSalons) {
      if (!guild.channels.cache.find(c => c.name === s)) {
        await guild.channels.create({ name: s, type: ChannelType.GuildText, parent: mainCat.id });
      }
    }

    // --- Salons vocaux BDA numérotés ---
    for (let i = 1; i <= 5; i++) {
      const vName = `💬 BDA ${i}`;
      if (!guild.channels.cache.find(c => c.name === vName)) {
        await guild.channels.create({ name: vName, type: ChannelType.GuildVoice, parent: mainCat.id });
      }
    }

    // --- Salons vocaux pour chaque rôle Staff ---
    for (const r of staffRoles) {
      const vName = `💬 ${r}`;
      if (!guild.channels.cache.find(c => c.name === vName)) {
        await guild.channels.create({ name: vName, type: ChannelType.GuildVoice, parent: mainCat.id });
      }
    }

    // --- Salons vocaux pour chaque rôle Urgence ---
    for (const r of urgenceRoles) {
      const vName = `💬 ${r}`;
      if (!guild.channels.cache.find(c => c.name === vName)) {
        await guild.channels.create({ name: vName, type: ChannelType.GuildVoice, parent: mainCat.id });
      }
    }

    message.channel.send("✅ Serveur Urgence Marseilla configuré avec tous les rôles, textuels et vocaux !");
  }

  // --- Commande whitelist ---
  if (message.content.startsWith("!wl")) {
    const args = message.content.split(" ");
    const id = args[1];
    if (!id) return message.reply("❌ Donne un ID FiveM");
    message.channel.send(`📋 Nouvelle demande whitelist : ID ${id}`);
  }
});

// --- Connexion sécurisée ---
client.login(process.env.TOKEN);
