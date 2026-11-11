
// DISPLAY SKINCARE ROUTINE

async function showRoutine() {

    const skinType = document.getElementById("skinType").value;
    const result = document.getElementById("result");

    if (!skinType) {
        result.innerHTML = "<h3>Please select your skin type! 💗</h3>";
        return;
    }

    result.innerHTML = "<h3>Loading your routine...</h3>";

    try {

        // Get routine from backend
        const response = await fetch(`/api/routines/${skinType}`);

        if (!response.ok) {
            throw new Error("Routine not found");
        }

        const data = await response.json();

        // Display routine
        result.innerHTML = `

            <h3>${data.name} 🌸</h3>

            <h4>☀️ Morning Routine</h4>

            <ol>
                ${data.morning.map(item =>
                    `<li>${item}</li>`
                ).join("")}
            </ol>

            <h4>🌙 Night Routine</h4>

            <ol>
                ${data.night.map(item =>
                    `<li>${item}</li>`
                ).join("")}
            </ol>

            <h4>🗓️ Weekly Skincare Tips</h4>

            <ul>
                ${data.weekly.map(item =>
                    `<li>${item}</li>`
                ).join("")}
            </ul>

            <h4>🛍️ Indian Product Recommendations</h4>

            <div class="product-list">

                ${data.products.map(product => `

                    <div class="product-item">
                        <strong>${product[0]}</strong>
                        <p>${product[1]}</p>
                    </div>

                `).join("")}

            </div>

            <h4>💡 Special Skincare Tip</h4>

            <p>${data.tips}</p>

            <p id="saveStatus">
                Saving your routine...
            </p>
        `;

        // Save selected skin type
        try {
            const saveResponse = await fetch("/api/selections", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    skinType: skinType
                })
            });

            if (!saveResponse.ok) {
                throw new Error("Could not save routine");
            }

            document.getElementById("saveStatus").innerHTML =
                "💗 Your routine has been saved successfully!";

        } catch (saveError) {

            console.error(saveError);

            document.getElementById("saveStatus").innerHTML =
                "Routine displayed, but saving failed.";
        }

    } catch (error) {

        console.error(error);

        result.innerHTML = `
            <h3>Something went wrong!</h3>
            <p>${error.message}</p>
            <p>Please check your backend server.</p>
        `;
    }
}


// VIEW SAVED ROUTINES

async function viewHistory() {

    const result = document.getElementById("history");

    try {

        const response = await fetch("/api/selections");

        if (!response.ok) {
            throw new Error("Unable to load history");
        }

        const history = await response.json();

        if (history.length === 0) {
            result.innerHTML = "<p>No saved routines yet.</p>";
            return;
        }

        result.innerHTML = history.map(item => `

            <div class="product-item">

                <h3>${item.skinName}</h3>

                <p>
                    Saved on:
                    ${new Date(item.date).toLocaleString()}
                </p>

                <button onclick="deleteHistory(${item.id})">
                    Delete
                </button>

            </div>

        `).join("");

    } catch (error) {

        console.error(error);
        result.innerHTML = "<p>Unable to load history.</p>";
    }
}


// DELETE SAVED ROUTINE

async function deleteHistory(id) {

    try {

        const response = await fetch(`/api/selections/${id}`, {
            method: "DELETE"
        });

        if (!response.ok) {
            throw new Error("Could not delete routine");
        }

        viewHistory();

    } catch (error) {

        alert(error.message);
    }
}


// DAILY CHECKLIST

const tasks = document.querySelectorAll(".task");

function updateProgress() {

    let completed = 0;

    tasks.forEach(task => {
        if (task.checked) {
            completed++;
        }
    });

    const progress = document.getElementById("progress");

    if (progress) {
        progress.innerText =
            `${completed} of ${tasks.length} tasks completed`;
    }
}

tasks.forEach(task => {
    task.addEventListener("change", updateProgress);
});

function resetChecklist() {

    tasks.forEach(task => {
        task.checked = false;
    });

    updateProgress();
}
