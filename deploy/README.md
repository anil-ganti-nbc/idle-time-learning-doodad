# DAU Practice Platform — NAS deployment (Container Manager / docker-compose)

Eight static lab builds behind one Caddy, plus the DAU host. Designed for
Tailscale: every service gets a stable `*.ts.net` hostname with real HTTPS,
and nothing is exposed to the internet.

## Layout on the NAS

```
/volume1/docker/dau/
├── docker-compose.yml      <- this folder's compose, adapted
├── Caddyfile               <- from deploy/Caddyfile
├── practice-urls.json      <- from deploy/practice-urls.json (edit hostnames)
└── repos/                  <- all nine repos cloned here
    ├── idle-time-learning-doodad/
    ├── dau-practice-labs/
    ├── chudbox/ ... ml-lab/
```

The idle-doodad image imports its sibling repos by relative path, so the
compose file mounts `./repos` into the container at the same depth it sees
on a dev machine.

## Steps

1. Install Container Manager + Tailscale on the NAS. Join the tailnet.
2. Clone the nine repos into `/volume1/docker/dau/repos/`.
3. Copy `Caddyfile` and `practice-urls.json` next to the compose file.
   Replace `tailnet-name` with your tailnet name everywhere.
4. In Tailscale admin → DNS, add a MagicDNS name per service OR use one
   hostname with path routing (the Caddyfile ships path-based: zero DNS work).
5. Container Manager → Project → create from the compose file.
6. Open `https://dau.<tailnet-name>.ts.net/` — done.

## HTTPS

With Tailscale enabled on the NAS, `tailscale cert` names work out of the
box via the Caddy `tls` block in this folder. For LAN-only HTTP instead,
delete the `tls` lines and use plain hostnames.
