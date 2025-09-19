const fs = require("fs");
const https = require("https");

const username = "esatyucel";
const url = `https://www.codewars.com/users/${username}.json`;

https.get(url, res => {
    let data = "";
    res.on("data", chunk => (data += chunk));
    res.on("end", () => {
        try {
            const user = JSON.parse(data);

            if (
                !user.username ||
                !user.ranks ||
                !user.ranks.overall ||
                !user.honor ||
                !user.leaderboardPosition ||
                !user.codeChallenges ||
                typeof user.codeChallenges.totalCompleted === "undefined"
            ) {
                throw new Error("Codewars API yanıtı beklenen formatta değil veya kullanıcı bulunamadı.");
            }

            const stats = `
<!-- CODEWARS-START -->
### 🥷 Codewars Stats
- **Username:** ${user.username}
- **Rank:** ${user.ranks.overall.name}
- **Honor:** ${user.honor}
- **Leaderboard Position:** ${user.leaderboardPosition}
- **Completed Kata:** ${user.codeChallenges.totalCompleted}

_Last updated: ${new Date().toLocaleString()}_
<!-- CODEWARS-END -->
`;

            let readme = fs.readFileSync("README.md", "utf8");

            if (readme.includes("<!-- CODEWARS-START -->")) {
                readme = readme.replace(
                    /<!-- CODEWARS-START -->(.|\n)*<!-- CODEWARS-END -->/,
                    stats
                );
            } else {
                readme += "\n" + stats;
            }

            fs.writeFileSync("README.md", readme);
        } catch (err) {
            console.error("Hata:", err.message);
            process.exit(1);
        }
    });
});