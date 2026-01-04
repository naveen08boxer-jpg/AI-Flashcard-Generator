const MAX_RECENT = 5;

// Load recent topics from localStorage
let recentTopics = JSON.parse(localStorage.getItem("recentTopics") || "[]");
updateRecentTopics();

async function generate() {
    const topicInput = document.getElementById("topic");
    const topic = topicInput.value.trim();
    if (!topic) {
        alert("Please enter a topic");
        return;
    }

    document.getElementById("loading").style.display = "block";
    document.getElementById("cards").innerHTML = "";

    try {
        const res = await fetch("http://127.0.0.1:5000/generate", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ topic })
        });

        const data = await res.json();
        document.getElementById("loading").style.display = "none";

        if (!data || data.length === 0) {
            document.getElementById("cards").innerHTML = "No flashcards generated.";
            return;
        }

        displayFlashcards(data);

        // Save topic to recent
        if (!recentTopics.includes(topic)) {
            recentTopics.unshift(topic);
            if (recentTopics.length > MAX_RECENT) recentTopics.pop();
            localStorage.setItem("recentTopics", JSON.stringify(recentTopics));
            updateRecentTopics();
        }

        // Save flashcards to localStorage
        localStorage.setItem(`flashcards-${topic}`, JSON.stringify(data));

    } catch (err) {
        document.getElementById("loading").style.display = "none";
        document.getElementById("cards").innerHTML = "Error generating flashcards. Check backend.";
        console.error(err);
    }
}

function displayFlashcards(cards) {
    const cardsDiv = document.getElementById("cards");
    cardsDiv.innerHTML = "";

    cards.forEach((card, index) => {
        const container = document.createElement("div");
        container.className = "card-container";

        const div = document.createElement("div");
        div.className = "card";

        div.innerHTML = `
            <div class="front">${card.question}</div>
            <div class="back">
                ${card.answer}<br><br>
                <button onclick="copyAnswer(event, ${index})">Copy Answer</button>
            </div>
        `;

        div.onclick = () => {
            div.classList.toggle("flipped");
        };

        container.appendChild(div);
        cardsDiv.appendChild(container);
    });
}

function copyAnswer(event, index) {
    event.stopPropagation(); // Prevent card flip when clicking button
    const back = document.querySelectorAll(".card .back")[index];
    const ans = back.innerText.replace("Copy Answer", "").trim();
    navigator.clipboard.writeText(ans);
    alert("Answer copied to clipboard!");
}

// Display recent topics buttons
function updateRecentTopics() {
    const listDiv = document.getElementById("recent-list");
    listDiv.innerHTML = "";
    recentTopics.forEach(topic => {
        const btn = document.createElement("button");
        btn.innerText = topic;
        btn.onclick = () => {
            document.getElementById("topic").value = topic;
            generate();
        };
        listDiv.appendChild(btn);
    });
}function clearRecent() {
    localStorage.removeItem("recentTopics");
    recentTopics = [];
    updateRecentTopics();
}
function clearAll() {
    // Clear recent topics
    localStorage.removeItem("recentTopics");
    recentTopics = [];
    updateRecentTopics();

    // Clear all stored flashcards
    Object.keys(localStorage).forEach(key => {
        if (key.startsWith("flashcards-")) {
            localStorage.removeItem(key);
        }
    });

    // Clear flashcards displayed on page
    document.getElementById("cards").innerHTML = "";

    // Clear topic input
    document.getElementById("topic").value = "";
}