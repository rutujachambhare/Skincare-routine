const express = require("express");
const fs = require("fs");
const path = require("path");
const app = express();
const PORT = 3000;
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));
const databasePath = path.join(__dirname, "data.json");

// Create database automatically
if (!fs.existsSync(databasePath)) {
    fs.writeFileSync(
        databasePath,
        JSON.stringify({ selections: [] }, null, 2)
    );
}

function readDatabase() {
    return JSON.parse(fs.readFileSync(databasePath, "utf8"));
}

function saveDatabase(data) {
    fs.writeFileSync(
        databasePath,
        JSON.stringify(data, null, 2)
    );
}

// SKINCARE ROUTINES
const routines = {

    oily: {
        name: "Oily Skin",
        morning: [
            "Wash your face with a gentle gel cleanser.",
            "Apply a lightweight moisturizer.",
            "Apply SPF 50 sunscreen."
        ],
        night: [
            "Cleanse your face gently.",
            "Apply Minimalist 5% Niacinamide serum (optional).",
            "Apply lightweight moisturizer."
        ],
        weekly: [
            "Avoid harsh scrubbing.",
            "Keep your skin hydrated.",
            "Avoid using too many active ingredients."
        ],
        products: [
            ["Cleanser", "Plum Green Tea Face Wash"],
            ["Serum", "Minimalist 5% Niacinamide"],
            ["Moisturizer", "Deconstruct Oil-Free Moisturizer"],
            ["Sunscreen", "Foxtale Oil Control SPF 50"]
        ],
        tips: "Avoid harsh scrubbing and overly drying products. Oily skin also needs moisturizer."
    },

    dry: {
        name: "Dry Skin",
        morning: [
            "Wash with a gentle hydrating cleanser.",
            "Apply hyaluronic acid serum (optional).",
            "Apply a rich moisturizer.",
            "Apply SPF 50 sunscreen."
        ],
        night: [
            "Cleanse your face gently.",
            "Apply a hydrating serum (optional).",
            "Apply a barrier repair moisturizer."
        ],
        weekly: [
            "Avoid hot water.",
            "Avoid harsh face scrubs.",
            "Use hydrating skincare products."
        ],
        products: [
            ["Cleanser", "Foxtale Hydrating Face Wash"],
            ["Serum", "Minimalist Hyaluronic Acid Serum"],
            ["Moisturizer", "Plum Cerasense Barrier Repair Moisturizer"],
            ["Sunscreen", "Dot & Key Barrier Repair SPF 50+"]
        ],
        tips: "Apply moisturizer while your skin is slightly damp to help retain moisture."
    },

    combination: {
        name: "Combination Skin",
        morning: [
            "Cleanse your face with a gentle cleanser.",
            "Apply a lightweight moisturizer.",
            "Apply SPF 50 sunscreen."
        ],
        night: [
            "Wash your face gently.",
            "Apply Niacinamide serum (optional).",
            "Apply a balanced moisturizer."
        ],
        weekly: [
            "Give extra hydration to dry areas.",
            "Avoid over-drying oily areas.",
            "Maintain a balanced skincare routine."
        ],
        products: [
            ["Cleanser", "Foxtale Hydrating Face Wash"],
            ["Serum", "Minimalist 5% Niacinamide"],
            ["Moisturizer", "Minimalist Vitamin B5 Moisturizer"],
            ["Sunscreen", "Deconstruct Gel Sunscreen SPF 50"]
        ],
        tips: "Use lightweight products on oily areas and provide extra hydration to dry areas."
    },

    normal: {
        name: "Normal Skin",
        morning: [
            "Wash with a gentle face cleanser.",
            "Apply Vitamin C serum (optional).",
            "Apply a light moisturizer.",
            "Apply SPF 50 sunscreen."
        ],
        night: [
            "Cleanse your face.",
            "Apply moisturizer.",
            "Keep your routine simple."
        ],
        weekly: [
            "Maintain a consistent skincare routine.",
            "Avoid unnecessary product changes.",
            "Keep your skin hydrated."
        ],
        products: [
            ["Cleanser", "Dot & Key Vitamin C Face Wash"],
            ["Serum", "Minimalist Vitamin C Serum"],
            ["Moisturizer", "Dot & Key Gel Moisturizer"],
            ["Sunscreen", "Dot & Key SPF 50+"]
        ],
        tips: "Keep your skincare routine simple and consistent."
    },

    sensitive: {
        name: "Sensitive Skin",
        morning: [
            "Wash with a mild fragrance-free cleanser.",
            "Apply a gentle moisturizer.",
            "Apply SPF 30-50 sunscreen that your skin tolerates."
        ],
        night: [
            "Cleanse your face gently.",
            "Apply a barrier-supporting moisturizer.",
            "Avoid strong active ingredients initially."
        ],
        weekly: [
            "Patch-test new skincare products.",
            "Avoid harsh scrubs.",
            "Avoid products that cause irritation."
        ],
        products: [
            ["Cleanser", "Minimalist Oat Extract Cleanser"],
            ["Serum", "No serum needed initially"],
            ["Moisturizer", "Plum Cerasense Barrier Repair Moisturizer"],
            ["Sunscreen", "Re'equil SPF 50 Sunscreen"]
        ],
        tips: "Introduce one new product at a time and avoid products that cause irritation."
    }
};

// GET ALL ROUTINES
app.get("/api/routines", (req, res) => {
    res.json(routines);
});

// GET ROUTINE BY SKIN TYPE
app.get("/api/routines/:skinType", (req, res) => {
    const skinType = req.params.skinType.toLowerCase();

    if (!routines[skinType]) {
        return res.status(404).json({
            message: "Skin type not found"
        });
    }

    res.json(routines[skinType]);
});

// SAVE SKIN TYPE
app.post("/api/selections", (req, res) => {
    const { skinType } = req.body;

    if (!skinType || !routines[skinType]) {
        return res.status(400).json({
            message: "Invalid skin type"
        });
    }

    const database = readDatabase();

    const newSelection = {
        id: Date.now(),
        skinType,
        skinName: routines[skinType].name,
        date: new Date().toISOString()
    };

    database.selections.push(newSelection);
    saveDatabase(database);

    res.status(201).json({
        message: "Routine saved successfully",
        selection: newSelection
    });
});

// VIEW HISTORY
app.get("/api/selections", (req, res) => {
    const database = readDatabase();
    res.json(database.selections);
});

// DELETE HISTORY
app.delete("/api/selections/:id", (req, res) => {
    const database = readDatabase();
    const id = Number(req.params.id);

    const updated = database.selections.filter(
        item => item.id !== id
    );

    if (updated.length === database.selections.length) {
        return res.status(404).json({
            message: "Selection not found"
        });
    }

    database.selections = updated;
    saveDatabase(database);

    res.json({
        message: "Routine deleted successfully"
    });
});
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "index.html"));
});
// START SERVER
app.listen(PORT, () => {
    console.log(`Glow & Care running at http://localhost:${PORT}`);
});
