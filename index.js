const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors()); 
app.use(express.json());

const API_KEY = 'ak_uo0qhsqhecihwbet67iu2ijv';
// YAHAN APNA LOGIN EMAIL DALEIN
const MY_EMAIL = 'your-email@example.com'; 

app.post('/analytics', (req, res) => {
    const providedKey = req.header('X-API-Key');
    if (providedKey !== API_KEY) {
        return res.status(401).json({ error: 'Unauthorized' });
    }

    const events = req.body.events || [];
    let total_events = events.length;
    let uniqueUsersSet = new Set();
    let revenue = 0;
    let userRevenueMap = {};

    events.forEach(event => {
        uniqueUsersSet.add(event.user);
        if (event.amount > 0) {
            revenue += event.amount;
            userRevenueMap[event.user] = (userRevenueMap[event.user] || 0) + event.amount;
        }
    });

    let top_user = "";
    let maxRevenue = -1;

    for (const [user, totalAmount] of Object.entries(userRevenueMap)) {
        if (totalAmount > maxRevenue) {
            maxRevenue = totalAmount;
            top_user = user;
        }
    }

    res.json({
        email: MY_EMAIL,
        total_events: total_events,
        unique_users: uniqueUsersSet.size,
        revenue: revenue,
        top_user: top_user
    });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
