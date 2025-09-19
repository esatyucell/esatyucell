import fs from "fs";
import https from "https";

const username = "esatyucel"; // Codewars kullanıcı adın
const url = `https://www.codewars.com/users/${username}.json`;

https.get(url, res => {
    let data = "";
    res.on("data", chunk => (data += chunk));
    res.on("end", () => {
        const user = JSON.parse(data);

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
    });
});
