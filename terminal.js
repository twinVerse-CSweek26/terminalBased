/* ═══════════════════════════════════════════════════════════════
   CRYPTICVERSE LEVEL 7 — FAKE TERMINAL ENGINE
   ═══════════════════════════════════════════════════════════════ */

(() => {
    "use strict";

    // ─── SECRET CODE ───
    const SECRET_CODE = "I open at the close";

    // ─── VIRTUAL FILE SYSTEM ───
    // File 1: 10 words, only 1 correctly spelled → "quantum"
    // File 2: 20 words, only 1 correctly spelled → "cipher"
    // File 3: 30 words, only 1 correctly spelled → "breach"

    const PASSWORD_WORDS = ["quantum", "cipher", "breach"];

    // The correct passphrase order (users must figure this out)
    // "cipher quantum breach" → unlocks access
    const CORRECT_PASSPHRASE = "cipher quantum breach";

    const FILE_SYSTEM = {
        "/": {
            type: "dir",
            children: ["classified", "logs", "README.txt"]
        },
        "/README.txt": {
            type: "file",
            content: [
                "╔══════════════════════════════════════════════╗",
                "║     CRYPTICVERSE SECURE TERMINAL — LEVEL 7      ║",
                "║                                              ║",
                "║  Welcome, Agent.                             ║",
                "║                                              ║",
                "║  This terminal is LOCKED. To gain access,    ║",
                "║  you must find the 3-word passphrase hidden  ║",
                "║  within the classified directory.            ║",
                "║                                              ║",
                "║  Each file contains a list of scrambled       ║",
                "║  words. Only ONE word per file is correctly  ║",
                "║  spelled. Find all three, arrange them in    ║",
                "║  the right order, and use the ACCESS command ║",
                "║  to unlock the system.                       ║",
                "║                                              ║",
                "║  Type 'help' for available commands.         ║",
                "║                                              ║",
                "║  HINT: The order matters. Think about what   ║",
                "║  comes first in a security breach...         ║",
                "╚══════════════════════════════════════════════╝"
            ]
        },
        "/logs": {
            type: "dir",
            children: ["system.log"]
        },
        "/logs/system.log": {
            type: "file",
            content: [
                "[2026-03-30 02:14:07] System boot initiated",
                "[2026-03-30 02:14:08] Kernel modules loaded",
                "[2026-03-30 02:14:09] Network interface UP",
                "[2026-03-30 02:14:10] Firewall rules applied",
                "[2026-03-30 02:14:11] WARNING: 3 unauthorized access attempts detected",
                "[2026-03-30 02:14:12] Security protocol OMEGA engaged",
                "[2026-03-30 02:14:13] All files encrypted under CLASSIFIED clearance",
                "[2026-03-30 02:14:14] Access locked — passphrase required",
                "[2026-03-30 02:14:15] HINT: First you decode the CIPHER...",
                "[2026-03-30 02:14:16] HINT: ...then harness the QUANTUM power...",
                "[2026-03-30 02:14:17] HINT: ...to finally cause the BREACH.",
                "[2026-03-30 02:14:18] System standing by for authentication."
            ]
        },
        "/classified": {
            type: "dir",
            children: ["fragment_alpha.dat", "fragment_beta.dat", "fragment_gamma.dat"]
        },
        "/classified/fragment_alpha.dat": {
            type: "file",
            content: [
                "┌──────────────────────────────────────────────────┐",
                "│  FRAGMENT ALPHA — DIFFICULTY: ★☆☆                │",
                "│  One word below is correctly spelled.            │",
                "│  Find it. That is your first key.                │",
                "└──────────────────────────────────────────────────┘",
                "",
                "  travorce  plundge  quantum  flikker  shaddow",
                "  graspel  chaulk  wissdom  beneeth  strugle",
                "",
                "  ── 10 words. 1 is real. Choose wisely. ──"
            ]
        },
        "/classified/fragment_beta.dat": {
            type: "file",
            content: [
                "┌──────────────────────────────────────────────────┐",
                "│  FRAGMENT BETA — DIFFICULTY: ★★☆                 │",
                "│  One word below is correctly spelled.            │",
                "│  The noise grows louder. Stay focused.           │",
                "└──────────────────────────────────────────────────┘",
                "",
                "  delvour  stelthy  proclame  envizion  harvist",
                "  whispre  cipher  fragmint  proclame  trechery",
                "  bewildur  corruppt  survael  conqur  sanctury",
                "  illustr  benovalent  prophecee  oblitterate",
                "",
                "  ── 20 words. 1 is real. The rest are lies. ──"
            ]
        },
        "/classified/fragment_gamma.dat": {
            type: "file",
            content: [
                "┌──────────────────────────────────────────────────┐",
                "│  FRAGMENT GAMMA — DIFFICULTY: ★★★                │",
                "│  One word below is correctly spelled.            │",
                "│  This is the final fragment. Concentrate.        │",
                "└──────────────────────────────────────────────────┘",
                "",
                "  renesance  perepheral  fullfill  obliderate",
                "  survaillence  mischevious  occassion  maintainse",
                "  accomadate  beaurocracy  definately  embarass",
                "  consciouss  dissappoint  exagerate  harrass",
                "  independant  milennium  breach  neccessary",
                "  occurance  perseverence  priviledge  recieve",
                "  seperate  threshhold  wierd  unforgetable",
                "  vulnerible  acquaintence",
                "",
                "  ── 30 words. 1 is real. Everything else is a trap. ──"
            ]
        }
    };

    // ─── STATE ───
    let currentDir = "/";
    let accessGranted = false;
    let commandHistory = [];
    let historyIndex = -1;

    // ─── DOM REFS ───
    const outputEl = document.getElementById("output");
    const inputEl = document.getElementById("cmd-input");
    const terminalBody = document.getElementById("terminal-body");
    const statusIndicator = document.getElementById("status-indicator");

    // ─── HELPERS ───
    function print(text, cls = "") {
        const div = document.createElement("div");
        div.className = "line" + (cls ? " " + cls : "");
        div.textContent = text;
        outputEl.appendChild(div);
        scrollToBottom();
    }

    function printMulti(lines, cls = "") {
        lines.forEach(line => print(line, cls));
    }

    function printBlank() {
        print("");
    }

    function scrollToBottom() {
        terminalBody.scrollTop = terminalBody.scrollHeight;
    }

    function resolvePath(path) {
        if (path.startsWith("/")) return normalizePath(path);
        const combined = currentDir === "/" ? "/" + path : currentDir + "/" + path;
        return normalizePath(combined);
    }

    function normalizePath(path) {
        const parts = path.split("/").filter(Boolean);
        const resolved = [];
        for (const p of parts) {
            if (p === "..") resolved.pop();
            else if (p !== ".") resolved.push(p);
        }
        return "/" + resolved.join("/");
    }

    // ─── COMMANDS ───
    const commands = {
        help() {
            printBlank();
            print("╔═══════════════════════════════════════════════╗", "cyan system");
            print("║          CRYPTICVERSE TERMINAL — HELP            ║", "cyan system");
            print("╠═══════════════════════════════════════════════╣", "cyan system");
            print("║                                               ║", "cyan system");
            print("║  NAVIGATION                                   ║", "cyan system");
            print("║  ──────────                                   ║", "cyan system");
            print("║  ls [path]       List files in directory      ║", "cyan system");
            print("║  cd <path>       Change directory             ║", "cyan system");
            print("║  pwd             Print current directory      ║", "cyan system");
            print("║                                               ║", "cyan system");
            print("║  FILE OPERATIONS                              ║", "cyan system");
            print("║  ───────────────                              ║", "cyan system");
            print("║  cat <file>      Display file contents        ║", "cyan system");
            print("║                                               ║", "cyan system");
            print("║  SECURITY                                     ║", "cyan system");
            print("║  ────────                                     ║", "cyan system");
            print("║  access <pass>   Attempt access with a        ║", "cyan system");
            print("║                  3-word passphrase            ║", "cyan system");
            print("║  status          Check lock status            ║", "cyan system");
            print("║                                               ║", "cyan system");
            print("║  OTHER                                        ║", "cyan system");
            print("║  ─────                                        ║", "cyan system");
            print("║  clear            Clear terminal              ║", "cyan system");
            print("║  help             Show this help menu         ║", "cyan system");
            print("║  hint             Get a hint                  ║", "cyan system");
            print("║  whoami           Display current user        ║", "cyan system");
            print("║                                               ║", "cyan system");
            print("╚═══════════════════════════════════════════════╝", "cyan system");
            printBlank();
            print("  TIP: Start by reading the README.txt file.", "warning");
            print("  Use: cat README.txt", "dim");
            printBlank();
        },

        ls(args) {
            const target = args.length > 0 ? resolvePath(args[0]) : currentDir;
            const node = FILE_SYSTEM[target];

            if (!node) {
                print(`ls: cannot access '${args[0] || target}': No such file or directory`, "error");
                return;
            }
            if (node.type !== "dir") {
                print(args[0] || target, "");
                return;
            }

            printBlank();
            node.children.forEach(child => {
                const childPath = target === "/" ? "/" + child : target + "/" + child;
                const childNode = FILE_SYSTEM[childPath];
                const isDir = childNode && childNode.type === "dir";
                if (isDir) {
                    print(`  📁  ${child}/`, "purple");
                } else {
                    print(`  📄  ${child}`, "");
                }
            });
            printBlank();
        },

        cd(args) {
            if (args.length === 0) {
                currentDir = "/";
                updatePrompt();
                return;
            }

            const target = resolvePath(args[0]);
            const node = FILE_SYSTEM[target];

            if (!node) {
                print(`cd: no such file or directory: ${args[0]}`, "error");
                return;
            }
            if (node.type !== "dir") {
                print(`cd: not a directory: ${args[0]}`, "error");
                return;
            }

            currentDir = target;
            updatePrompt();
        },

        pwd() {
            print(currentDir);
        },

        cat(args) {
            if (args.length === 0) {
                print("cat: missing file operand", "error");
                print("Usage: cat <filename>", "dim");
                return;
            }

            const target = resolvePath(args[0]);
            const node = FILE_SYSTEM[target];

            if (!node) {
                print(`cat: ${args[0]}: No such file or directory`, "error");
                return;
            }
            if (node.type === "dir") {
                print(`cat: ${args[0]}: Is a directory`, "error");
                return;
            }

            printBlank();
            node.content.forEach(line => print(line));
            printBlank();
        },

        access(args) {
            if (accessGranted) {
                print("Access already granted. The secret code has been revealed.", "success");
                return;
            }

            if (args.length === 0) {
                print("access: missing passphrase", "error");
                print("Usage: access <word1> <word2> <word3>", "dim");
                print("Provide the 3 correctly spelled words in the right order.", "dim");
                return;
            }

            const attempt = args.join(" ").toLowerCase().trim();

            if (attempt === CORRECT_PASSPHRASE) {
                accessGranted = true;

                // Update status
                statusIndicator.className = "terminal-status unlocked";
                statusIndicator.innerHTML = '<span class="status-dot"></span> UNLOCKED';

                printBlank();
                print("  ██████████████████████████████████████████", "success");
                print("  █                                        █", "success");
                print("  █         ACCESS GRANTED ✓               █", "success");
                print("  █                                        █", "success");
                print("  ██████████████████████████████████████████", "success");
                printBlank();
                print("  Decrypting classified payload...", "warning");

                setTimeout(() => {
                    print("  ███████░░░░░░░░░░░░░░░   25%", "dim");
                }, 500);
                setTimeout(() => {
                    print("  ██████████████░░░░░░░░   55%", "dim");
                }, 1000);
                setTimeout(() => {
                    print("  █████████████████████░   85%", "dim");
                }, 1500);
                setTimeout(() => {
                    print("  ████████████████████████ 100%", "success");
                    printBlank();
                    print(`  🔑 SECRET FINAL CODE: "${SECRET_CODE}"`, "success bold");
                    printBlank();
                    print("  Submit this code in the final Google Form.", "warning");
                    print("  Congratulations, Agent. You've completed Level 7.", "system");
                    printBlank();

                    // Show access overlay after a beat
                    setTimeout(showAccessOverlay, 1500);
                }, 2200);
            } else {
                // Check if they have the right words but wrong order
                const attemptWords = attempt.split(/\s+/);
                const sortedAttempt = [...attemptWords].sort().join(" ");
                const sortedCorrect = [...PASSWORD_WORDS].sort().join(" ");

                printBlank();
                print("  ╳ ACCESS DENIED", "error bold");
                printBlank();

                if (sortedAttempt === sortedCorrect) {
                    print("  Hmm... you have the right words, but the ORDER is wrong.", "warning");
                    print("  Think about the logical sequence of a security event.", "dim");
                    print("  Hint: Check the system logs carefully.", "dim");
                } else {
                    print("  Incorrect passphrase. Try again.", "error");
                    print("  Have you found all 3 correctly spelled words?", "dim");
                    print("  Use 'hint' for guidance.", "dim");
                }
                printBlank();
            }
        },

        status() {
            printBlank();
            if (accessGranted) {
                print("  STATUS: UNLOCKED 🔓", "success bold");
                print(`  Secret Code: "${SECRET_CODE}"`, "success");
            } else {
                print("  STATUS: LOCKED 🔒", "error bold");
                print("  A 3-word passphrase is required to unlock the terminal.", "dim");
                print("  Type 'help' for available commands.", "dim");
            }
            printBlank();
        },

        hint(args) {
            const hints = [
                {
                    title: "HINT 1 — Getting Started",
                    lines: [
                        "Start by reading the README file:",
                        "  cat README.txt",
                        "",
                        "Then explore the file system:",
                        "  ls",
                        "  cd classified",
                        "  ls"
                    ]
                },
                {
                    title: "HINT 2 — Finding the Words",
                    lines: [
                        "Each fragment file contains a list of words.",
                        "Most are MISSPELLED. Only ONE per file is correct.",
                        "",
                        "Read each file carefully:",
                        "  cat fragment_alpha.dat",
                        "  cat fragment_beta.dat",
                        "  cat fragment_gamma.dat",
                        "",
                        "Look for the ONE correctly spelled English word!"
                    ]
                },
                {
                    title: "HINT 3 — The Order",
                    lines: [
                        "Once you have 3 words, you need the RIGHT ORDER.",
                        "Check the system logs for clues:",
                        "  cat /logs/system.log",
                        "",
                        "Think: in a security event, what happens first?",
                        "You decode, then power up, then... 💥"
                    ]
                },
                {
                    title: "HINT 4 — Using Access",
                    lines: [
                        "Once you know the 3 words in order, type:",
                        "  access <word1> <word2> <word3>",
                        "",
                        "Example: access apple banana cherry",
                        "(That's not the real passphrase, obviously 😉)"
                    ]
                }
            ];

            const hintNum = args.length > 0 ? parseInt(args[0]) : null;

            if (hintNum && hintNum >= 1 && hintNum <= hints.length) {
                printBlank();
                print(`  ── ${hints[hintNum - 1].title} ──`, "orange bold");
                hints[hintNum - 1].lines.forEach(l => print("  " + l, "warning"));
                printBlank();
            } else {
                printBlank();
                print("  Available hints (type 'hint <number>'):", "orange");
                hints.forEach((h, i) => {
                    print(`    hint ${i + 1}  —  ${h.title}`, "dim");
                });
                printBlank();
            }
        },

        clear() {
            outputEl.innerHTML = "";
        },

        whoami() {
            print("guest (restricted — Level 7 clearance pending)", "dim");
        }
    };

    // Aliases
    commands.dir = commands.ls;

    // ─── PROMPT UPDATE ───
    function updatePrompt() {
        const promptEl = document.querySelector(".prompt");
        const dirDisplay = currentDir === "/" ? "~" : "~" + currentDir;
        promptEl.textContent = `guest@crypticverse:${dirDisplay}$ `;
    }

    // ─── COMMAND PROCESSING ───
    function processCommand(raw) {
        const trimmed = raw.trim();
        if (!trimmed) return;

        // Echo the command
        const dirDisplay = currentDir === "/" ? "~" : "~" + currentDir;
        print(`guest@crypticverse:${dirDisplay}$ ${trimmed}`, "dim");

        commandHistory.unshift(trimmed);
        historyIndex = -1;

        const parts = trimmed.split(/\s+/);
        const cmd = parts[0].toLowerCase();
        const args = parts.slice(1);

        // Special: access needs the full args
        if (cmd === "access") {
            commands.access(args);
            return;
        }

        if (commands[cmd]) {
            commands[cmd](args);
        } else {
            print(`bash: ${cmd}: command not found`, "error");
            print("Type 'help' to see available commands.", "dim");
        }
    }

    // ─── INPUT HANDLING ───
    inputEl.addEventListener("keydown", (e) => {
        if (e.key === "Enter") {
            const val = inputEl.value;
            inputEl.value = "";
            processCommand(val);
        } else if (e.key === "ArrowUp") {
            e.preventDefault();
            if (historyIndex < commandHistory.length - 1) {
                historyIndex++;
                inputEl.value = commandHistory[historyIndex];
            }
        } else if (e.key === "ArrowDown") {
            e.preventDefault();
            if (historyIndex > 0) {
                historyIndex--;
                inputEl.value = commandHistory[historyIndex];
            } else {
                historyIndex = -1;
                inputEl.value = "";
            }
        } else if (e.key === "Tab") {
            e.preventDefault();
            autocomplete(inputEl.value);
        }
    });

    // Click anywhere to focus input
    document.addEventListener("click", () => inputEl.focus());

    // ─── TAB AUTOCOMPLETE ───
    function autocomplete(partial) {
        const parts = partial.split(/\s+/);
        if (parts.length <= 1) {
            // Autocomplete commands
            const prefix = parts[0].toLowerCase();
            const matches = Object.keys(commands).filter(c => c.startsWith(prefix));
            if (matches.length === 1) {
                inputEl.value = matches[0] + " ";
            } else if (matches.length > 1) {
                print(`guest@crypticverse:~$ ${partial}`, "dim");
                print(matches.join("  "), "system");
            }
        } else {
            // Autocomplete file/dir names
            const pathPart = parts[parts.length - 1];
            const dir = pathPart.includes("/")
                ? resolvePath(pathPart.substring(0, pathPart.lastIndexOf("/")))
                : currentDir;

            const node = FILE_SYSTEM[dir];
            if (node && node.type === "dir") {
                const prefix = pathPart.includes("/")
                    ? pathPart.substring(pathPart.lastIndexOf("/") + 1)
                    : pathPart;

                const matches = node.children.filter(c =>
                    c.toLowerCase().startsWith(prefix.toLowerCase())
                );

                if (matches.length === 1) {
                    parts[parts.length - 1] = pathPart.includes("/")
                        ? pathPart.substring(0, pathPart.lastIndexOf("/") + 1) + matches[0]
                        : matches[0];
                    inputEl.value = parts.join(" ");
                } else if (matches.length > 1) {
                    print(`guest@crypticverse:~$ ${partial}`, "dim");
                    print(matches.join("  "), "system");
                }
            }
        }
    }

    // ─── ACCESS OVERLAY ───
    function showAccessOverlay() {
        const overlay = document.getElementById("access-overlay");
        overlay.classList.remove("hidden");

        // Set secret code text with typewriter feel
        const codeEl = document.getElementById("secret-code");
        typewriterEffect(codeEl, `"${SECRET_CODE}"`, 80);

        // Spawn particles
        const particleContainer = document.getElementById("access-particles");
        for (let i = 0; i < 50; i++) {
            const p = document.createElement("div");
            p.className = "particle";
            p.style.left = Math.random() * 100 + "%";
            p.style.animationDelay = Math.random() * 3 + "s";
            p.style.animationDuration = (2 + Math.random() * 3) + "s";
            const size = 2 + Math.random() * 6;
            p.style.width = size + "px";
            p.style.height = size + "px";
            p.style.background = Math.random() > 0.5 ? "var(--green-primary)" : "var(--cyan)";
            particleContainer.appendChild(p);
        }
    }

    function typewriterEffect(el, text, speed) {
        let i = 0;
        el.textContent = "";
        const interval = setInterval(() => {
            el.textContent += text[i];
            i++;
            if (i >= text.length) clearInterval(interval);
        }, speed);
    }

    // ─── BOOT SEQUENCE ───
    function runBootSequence() {
        const overlay = document.getElementById("boot-overlay");
        const linesContainer = document.getElementById("boot-lines");
        const progressBar = document.getElementById("boot-progress");
        const statusEl = document.getElementById("boot-status");

        const bootMessages = [
            { text: "Loading kernel modules...", type: "ok" },
            { text: "Mounting virtual filesystem...", type: "ok" },
            { text: "Initializing network stack...", type: "ok" },
            { text: "Loading security protocols...", type: "ok" },
            { text: "Scanning for threats...", type: "warn" },
            { text: "3 unauthorized intrusion attempts detected", type: "warn" },
            { text: "Engaging OMEGA security lockdown...", type: "ok" },
            { text: "Encrypting classified files...", type: "ok" },
            { text: "Terminal access restricted — passphrase required", type: "fail" },
            { text: "Booting guest terminal session...", type: "ok" },
        ];

        let current = 0;

        function showNext() {
            if (current >= bootMessages.length) {
                progressBar.style.width = "100%";
                statusEl.textContent = "Boot complete. Launching terminal...";
                setTimeout(() => {
                    overlay.classList.add("hidden");
                    document.getElementById("terminal-wrapper").classList.remove("hidden");
                    showWelcome();
                    inputEl.focus();
                }, 800);
                return;
            }

            const msg = bootMessages[current];
            const line = document.createElement("div");
            line.className = `line ${msg.type}`;
            line.textContent = msg.text;
            linesContainer.appendChild(line);

            progressBar.style.width = ((current + 1) / bootMessages.length * 100) + "%";
            statusEl.textContent = msg.text;

            current++;
            setTimeout(showNext, 200 + Math.random() * 250);
        }

        setTimeout(showNext, 600);
    }

    // ─── WELCOME MESSAGE ───
    function showWelcome() {
        print("", "");
        print("   ██████╗██████╗ ██╗   ██╗██████╗ ████████╗██╗ ██████╗██╗   ██╗███████╗██████╗ ███████╗███████╗", "success");
        print("  ██╔════╝██╔══██╗╚██╗ ██╔╝██╔══██╗╚══██╔══╝██║██╔════╝██║   ██║██╔════╝██╔══██╗██╔════╝██╔════╝", "success");
        print("  ██║     ██████╔╝ ╚████╔╝ ██████╔╝   ██║   ██║██║     ██║   ██║█████╗  ██████╔╝███████╗█████╗  ", "success");
        print("  ██║     ██╔══██╗  ╚██╔╝  ██╔═══╝    ██║   ██║██║     ╚██╗ ██╔╝██╔══╝  ██╔══██╗╚════██║██╔══╝  ", "success");
        print("  ╚██████╗██║  ██║   ██║   ██║        ██║   ██║╚██████╗ ╚████╔╝ ███████╗██║  ██║███████║███████╗", "success");
        print("   ╚═════╝╚═╝  ╚═╝   ╚═╝   ╚═╝        ╚═╝   ╚═╝ ╚═════╝  ╚═══╝  ╚══════╝╚═╝  ╚═╝╚══════╝╚══════╝", "success");
        printBlank();
        print("  ─────────────────────────────────────────────────────────", "dim");
        print("  SECURE TERMINAL v7.0.1  |  STATUS: LOCKED 🔒  |  LEVEL 7", "warning");
        print("  ─────────────────────────────────────────────────────────", "dim");
        printBlank();
        print("  Welcome, Agent. This terminal is under OMEGA lockdown.", "system");
        print("  Your mission: Find the 3-word passphrase to unlock access.", "system");
        printBlank();
        print("  Type 'help' to see available commands.", "");
        print("  Type 'cat README.txt' to read the mission briefing.", "dim");
        printBlank();
    }

    // ─── INIT ───
    runBootSequence();
})();
