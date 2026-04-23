#!/usr/bin/env python3
"""
XBear Instagram Gallery Scraper
================================

Belirtilen Instagram hesaplarından (xbearevent, xbearmedia) son gönderileri
çeker, thumbnail'leri indirir ve `assets/data/gallery.json` dosyasını üretir.

Bu JSON, site tarafından `js/main.js` içinden okunur ve galeri otomatik olarak
yeniden doldurulur.

Kullanım
--------

    cd scraper
    python3 -m venv .venv
    source .venv/bin/activate
    pip install -r requirements.txt

    # (Opsiyonel) giri\u015f yapm\u0131\u015f bir oturum kullanmak rate-limit'i
    # \u00f6nemli \u00f6l\u00e7\u00fcde azalt\u0131r:
    #   instaloader --login=<kullanici_adin>
    # Sonra bu script'i o kullan\u0131c\u0131 ad\u0131yla \u00e7al\u0131\u015ft\u0131r:
    #   python fetch_instagram.py --login <kullanici_adin>

    python fetch_instagram.py

G\u00fcvenli davran\u0131\u015f
-----------------
- Varsay\u0131lan olarak her hesap ba\u015f\u0131na son 30 g\u00f6nderiyi \u00e7eker.
- \u0130stekler aras\u0131na gecikme koyar; rate-limit'e tak\u0131lmamaya \u00e7al\u0131\u015f\u0131r.
- Zaten indirilmi\u015f thumbnail'leri tekrar indirmez.
"""

from __future__ import annotations

import argparse
import json
import logging
import os
import random
import re
import sys
import time
from dataclasses import dataclass, asdict
from datetime import datetime, timezone
from pathlib import Path
from typing import Iterable

try:
    import instaloader
except ImportError:  # pragma: no cover
    sys.stderr.write(
        "\n[HATA] 'instaloader' kurulu de\u011fil. \u00d6nce:\n"
        "    pip install -r scraper/requirements.txt\n\n"
    )
    raise


# ---------------------------------------------------------------------------
# Ayarlar
# ---------------------------------------------------------------------------

ROOT = Path(__file__).resolve().parents[1]
DATA_DIR = ROOT / "assets" / "data"
IMAGES_DIR = ROOT / "assets" / "images" / "gallery" / "auto"
JSON_OUT = DATA_DIR / "gallery.json"

DEFAULT_ACCOUNTS = [
    {"username": "xbearevent", "label": "XBear Event"},
    {"username": "xbearmedia", "label": "XBear Media"},
]
DEFAULT_LIMIT = 30


logging.basicConfig(
    level=logging.INFO,
    format="[%(asctime)s] %(levelname)s %(message)s",
    datefmt="%H:%M:%S",
)
log = logging.getLogger("xbear-scraper")


# ---------------------------------------------------------------------------
# Veri s\u0131n\u0131flar\u0131
# ---------------------------------------------------------------------------

@dataclass
class GalleryItem:
    shortcode: str
    type: str            # "photo" | "reel"
    thumb: str           # web sitesi i\u00e7inden kullan\u0131lacak g\u00f6rece yol
    permalink: str
    caption: str
    title: str
    timestamp: str


@dataclass
class AccountBucket:
    username: str
    label: str
    photos: list[GalleryItem]
    reels: list[GalleryItem]


# ---------------------------------------------------------------------------
# Yard\u0131mc\u0131lar
# ---------------------------------------------------------------------------

def build_loader(login_user: str | None) -> instaloader.Instaloader:
    loader = instaloader.Instaloader(
        dirname_pattern=str(IMAGES_DIR / "{profile}"),
        filename_pattern="{shortcode}",
        download_pictures=False,
        download_videos=False,
        download_video_thumbnails=False,
        download_geotags=False,
        download_comments=False,
        save_metadata=False,
        post_metadata_txt_pattern="",
        max_connection_attempts=3,
        request_timeout=20,
    )

    if login_user:
        try:
            loader.load_session_from_file(login_user)
            log.info("Mevcut instaloader oturumu y\u00fcklendi: %s", login_user)
        except FileNotFoundError:
            log.warning(
                "'%s' i\u00e7in kay\u0131tl\u0131 oturum bulunamad\u0131. \u00d6nce:\n"
                "    instaloader --login=%s\n"
                "komutunu \u00e7al\u0131\u015ft\u0131r.",
                login_user,
                login_user,
            )
    return loader


def short_title(caption: str, max_len: int = 48) -> str:
    text = (caption or "").strip().splitlines()[0] if caption else ""
    text = re.sub(r"\s+", " ", text)
    if not text:
        return ""
    if len(text) <= max_len:
        return text
    return text[: max_len - 1].rstrip() + "\u2026"


def ensure_dirs() -> None:
    DATA_DIR.mkdir(parents=True, exist_ok=True)
    IMAGES_DIR.mkdir(parents=True, exist_ok=True)


def download_thumbnail(url: str, target: Path) -> bool:
    """Thumbnail'i indirir. Zaten varsa atlar. Ba\u015far\u0131l\u0131ysa True d\u00f6ner."""
    if target.exists() and target.stat().st_size > 0:
        return True
    target.parent.mkdir(parents=True, exist_ok=True)
    try:
        import urllib.request
        req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"})
        with urllib.request.urlopen(req, timeout=20) as response, target.open("wb") as f:
            f.write(response.read())
        return True
    except Exception as exc:  # pragma: no cover
        log.warning("Thumbnail indirilemedi (%s): %s", target.name, exc)
        return False


def classify(post: instaloader.Post) -> str:
    return "reel" if post.is_video else "photo"


# ---------------------------------------------------------------------------
# Ana ak\u0131\u015f
# ---------------------------------------------------------------------------

def fetch_account(
    loader: instaloader.Instaloader,
    username: str,
    label: str,
    limit: int,
) -> AccountBucket:
    log.info("Hesap \u00e7ekiliyor: @%s (son %d post)", username, limit)
    try:
        profile = instaloader.Profile.from_username(loader.context, username)
    except instaloader.exceptions.ProfileNotExistsException:
        log.error("@%s bulunamad\u0131.", username)
        return AccountBucket(username=username, label=label, photos=[], reels=[])

    photos: list[GalleryItem] = []
    reels: list[GalleryItem] = []

    count = 0
    for post in profile.get_posts():
        if count >= limit:
            break

        kind = classify(post)
        thumb_url = post.url  # en yakc\u0131 kalitedeki thumbnail
        rel_thumb = Path("assets") / "images" / "gallery" / "auto" / username / f"{post.shortcode}.jpg"
        abs_thumb = ROOT / rel_thumb
        download_thumbnail(thumb_url, abs_thumb)

        item = GalleryItem(
            shortcode=post.shortcode,
            type=kind,
            thumb=str(rel_thumb).replace(os.sep, "/"),
            permalink=f"https://www.instagram.com/p/{post.shortcode}/"
                      if kind == "photo"
                      else f"https://www.instagram.com/reel/{post.shortcode}/",
            caption=(post.caption or "").strip(),
            title=short_title(post.caption or ""),
            timestamp=post.date_utc.replace(tzinfo=timezone.utc).isoformat(),
        )

        (reels if kind == "reel" else photos).append(item)
        count += 1

        # Rate-limit dostu k\u0131sa bekleme
        time.sleep(random.uniform(0.8, 1.8))

    log.info(
        "@%s tamamland\u0131: %d foto\u011fraf, %d reel",
        username,
        len(photos),
        len(reels),
    )
    return AccountBucket(username=username, label=label, photos=photos, reels=reels)


def write_json(buckets: Iterable[AccountBucket]) -> None:
    payload = {
        "updated_at": datetime.now(timezone.utc).isoformat(timespec="seconds"),
        "accounts": {
            bucket.username: {
                "username": bucket.username,
                "label": bucket.label,
                "photos": [asdict(i) for i in bucket.photos],
                "reels": [asdict(i) for i in bucket.reels],
            }
            for bucket in buckets
        },
    }
    JSON_OUT.write_text(json.dumps(payload, ensure_ascii=False, indent=2), encoding="utf-8")
    log.info("JSON yaz\u0131ld\u0131: %s", JSON_OUT.relative_to(ROOT))


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="XBear Instagram galeri toplay\u0131c\u0131")
    parser.add_argument(
        "--limit",
        type=int,
        default=DEFAULT_LIMIT,
        help=f"Her hesaptan al\u0131nacak son post say\u0131s\u0131 (varsay\u0131lan: {DEFAULT_LIMIT})",
    )
    parser.add_argument(
        "--login",
        help="Daha \u00f6nce 'instaloader --login=<kullanici>' ile kaydedilmi\u015f oturum ad\u0131.",
    )
    parser.add_argument(
        "--accounts",
        nargs="+",
        help="\u00d6zel hesap listesi (varsay\u0131lan: xbearevent xbearmedia).",
    )
    return parser.parse_args()


def main() -> int:
    args = parse_args()
    ensure_dirs()

    loader = build_loader(args.login)

    accounts = DEFAULT_ACCOUNTS
    if args.accounts:
        accounts = [{"username": u, "label": u} for u in args.accounts]

    buckets: list[AccountBucket] = []
    for entry in accounts:
        try:
            bucket = fetch_account(
                loader=loader,
                username=entry["username"],
                label=entry["label"],
                limit=args.limit,
            )
            buckets.append(bucket)
        except instaloader.exceptions.ConnectionException as exc:
            log.error("@%s i\u00e7in ba\u011flant\u0131 hatas\u0131: %s", entry["username"], exc)
        except KeyboardInterrupt:
            log.warning("Kullan\u0131c\u0131 taraf\u0131ndan iptal edildi.")
            break

    if not buckets:
        log.error("Hi\u00e7bir hesap verisi al\u0131namad\u0131.")
        return 1

    write_json(buckets)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
