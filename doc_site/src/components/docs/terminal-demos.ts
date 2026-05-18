import type { CommandEntry } from "#/components/ui/Terminable";

export const quickStartDemo: CommandEntry[] = [
  {
    prompt: "sshm0 add web1 192.168.1.25 deploy --auth key --key ~/.ssh/id_rsa",
    output: '\u2713 Server "web1" saved.',
    typingSpeed: 35,
    delay: 800,
  },
  {
    prompt: "sshm0 connect web1",
    output: "Connecting to deploy@192.168.1.25...",
    typingSpeed: 40,
    delay: 1000,
  },
];

export const addDemo: CommandEntry[] = [
  {
    prompt:
      "sshm0 add web1 192.168.1.25 deploy --auth key --key ~/.ssh/id_ed25519",
    output: '\u2713 Server "web1" saved.',
    typingSpeed: 35,
    delay: 800,
  },
  {
    prompt: "sshm0 add db db.example.com admin --port 3306 --tag prod,db",
    output: '\u2713 Server "db" saved.',
    typingSpeed: 35,
    delay: 1000,
  },
];

export const connectDemo: CommandEntry[] = [
  {
    prompt: "sshm0 connect web1",
    output: "Connecting to deploy@192.168.1.25...",
    typingSpeed: 40,
    delay: 800,
  },
  {
    prompt: "sshm0 connect web1 --cd /var/log",
    output: "Connecting to deploy@192.168.1.25...",
    typingSpeed: 35,
    delay: 1000,
  },
  {
    prompt: "sshm0 connect web1 ls -la /tmp",
    output: "Connecting to deploy@192.168.1.25...",
    typingSpeed: 35,
    delay: 1000,
  },
];

export const listDemo: CommandEntry[] = [
  {
    prompt: "sshm0 list",
    output: ["  staging", "  web1", "  db"],
    typingSpeed: 40,
    delay: 800,
  },
  {
    prompt: "sshm0 list --long",
    output: [
      "  NAME       HOST             USER     AUTH      TAGS",
      "  db         db.example.com   admin    key       prod,db",
      "  staging    10.0.0.5         root     password",
      "  web1       192.168.1.25     deploy   key",
    ],
    typingSpeed: 35,
    delay: 1200,
  },
  {
    prompt: "sshm0 list --tag prod --long",
    output: [
      "  NAME       HOST             USER     AUTH      TAGS",
      "  db         db.example.com   admin    key       prod,db",
    ],
    typingSpeed: 35,
    delay: 1200,
  },
];

export const exportDemo: CommandEntry[] = [
  {
    prompt: "sshm0 export",
    output: "Written to ~/.ssh/config.d/sshm0",
    typingSpeed: 40,
    delay: 800,
  },
  {
    prompt: "cat ~/.ssh/config.d/sshm0",
    output: [
      "Host web1",
      "    HostName 192.168.1.25",
      "    User deploy",
      "    IdentityFile ~/.ssh/id_ed25519",
      "",
      "Host staging",
      "    HostName 10.0.0.5",
      "    User root",
      "    Port 2222",
      "    # Use: sshm0 connect staging",
    ],
    typingSpeed: 30,
    delay: 1000,
  },
];
