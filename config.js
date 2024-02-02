import path from 'path';
import { fileURLToPath } from 'url';
import {Client, GatewayIntentBits} from 'discord.js'

export const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent], restRequestTimeout: 60000000 });

export const PORT = 5000;
export const MAX_SIZE_MB = 3;
export const MAX_SIZE_BYTES = 3000000;
export const temp_map = {}

export const channelID = '1197277130686472333';
export const __dirname = path.dirname(fileURLToPath(import.meta.url));