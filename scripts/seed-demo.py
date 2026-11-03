"""Seed a running TaskFlow API with demo data for screenshots.

Creates four demo accounts, three projects and 23 tasks with due dates
relative to today, so the dashboard always shows due-today and upcoming work.

Usage: python3 scripts/seed-demo.py [API_URL]   (default http://localhost:3001)
"""
import json
import sys
import urllib.error
import urllib.request
from datetime import date, datetime, time, timedelta, timezone

API = sys.argv[1] if len(sys.argv) > 1 else "http://localhost:3001"
PASSWORD = "DemoPass#2026"

USERS = {
    "you": ("Meryeme Mesbahi", "meryeme@taskflow.test"),
    "sarah": ("Sarah Johnson", "sarah@taskflow.test"),
    "alex": ("Alex Martin", "alex@taskflow.test"),
    "yasmine": ("Yasmine Benali", "yasmine@taskflow.test"),
}

# (title, status, priority, assignee, due in days from today)
PROJECTS = [
    ("Website Redesign",
     "Full redesign of the company website: new branding, faster pages and a mobile-first layout, launching before the end of the year.",
     [
         ("Define new color palette and typography", "DONE", "HIGH", "sarah", -13),
         ("Audit current site performance", "DONE", "MEDIUM", "alex", -9),
         ("Design homepage mockup", "DONE", "HIGH", "sarah", -4),
         ("Build responsive navbar", "REVIEW", "MEDIUM", "you", 0),
         ("Set up CMS for blog posts", "REVIEW", "MEDIUM", "alex", 2),
         ("Develop homepage sections", "IN_PROGRESS", "HIGH", "you", 3),
         ("Optimize images and lazy loading", "IN_PROGRESS", "MEDIUM", "alex", 5),
         ("Write copy for About page", "IN_PROGRESS", "LOW", "yasmine", 6),
         ("Build contact form with validation", "TODO", "MEDIUM", "you", 10),
         ("SEO meta tags for all pages", "TODO", "MEDIUM", "yasmine", 12),
         ("Cross-browser testing", "TODO", "HIGH", "alex", 16),
         ("Launch and set up 301 redirects", "TODO", "HIGH", "you", 23),
     ]),
    ("Mobile App Launch",
     "Launch the iOS and Android app: beta testing, store listings and launch-day support.",
     [
         ("Recruit 50 beta testers", "DONE", "MEDIUM", "yasmine", -6),
         ("Fix login crash on Android 13", "REVIEW", "HIGH", "alex", 0),
         ("Prepare App Store screenshots", "IN_PROGRESS", "MEDIUM", "sarah", 4),
         ("Set up push notifications", "IN_PROGRESS", "HIGH", "alex", 7),
         ("Write store description", "TODO", "LOW", "yasmine", 13),
         ("Submit to App Store review", "TODO", "HIGH", "you", 18),
     ]),
    ("Q4 Marketing Campaign",
     "Holiday campaign across email, social media and paid ads to grow sign-ups by 30%.",
     [
         ("Define campaign goals and budget", "DONE", "HIGH", "yasmine", -11),
         ("Design social media visuals", "IN_PROGRESS", "MEDIUM", "sarah", 2),
         ("Set up email sequence", "TODO", "MEDIUM", "yasmine", 8),
         ("Launch ads", "TODO", "HIGH", "yasmine", 18),
         ("Weekly results report", "TODO", "LOW", "you", 28),
     ]),
]


def call(method, path, body=None, token=None):
    req = urllib.request.Request(API + path, method=method,
                                 data=json.dumps(body).encode() if body is not None else None,
                                 headers={"Content-Type": "application/json"})
    if token:
        req.add_header("Authorization", f"Bearer {token}")
    try:
        with urllib.request.urlopen(req) as res:
            raw = res.read()
            return json.loads(raw) if raw else None
    except urllib.error.HTTPError as err:
        raise SystemExit(f"{method} {path} -> {err.code}: {err.read().decode()[:300]}")


def login(email):
    data = call("POST", "/auth/login", {"email": email, "password": PASSWORD})
    return data.get("accessToken") or data.get("access_token") or data["tokens"]["accessToken"]


def due(days):
    # Late evening for today's tasks so they never show as overdue; noon otherwise.
    day = date.today() + timedelta(days=days)
    return datetime.combine(day, time(23, 30) if days == 0 else time(12)).astimezone(timezone.utc).isoformat().replace("+00:00", "Z")


tokens, ids = {}, {}
for key, (name, email) in USERS.items():
    try:
        call("POST", "/auth/register", {"email": email, "password": PASSWORD, "fullName": name})
    except SystemExit as exc:
        if "409" not in str(exc):
            raise
    tokens[key] = login(email)
    ids[key] = call("GET", "/auth/profile", token=tokens[key])["id"]

for name, description, tasks in PROJECTS:
    project = call("POST", "/projects", {"name": name, "description": description}, tokens["you"])
    teammates = [USERS[k][1] for k in ("sarah", "alex", "yasmine")]
    call("POST", f"/projects/{project['id']}/invitations", {"emails": teammates}, tokens["you"])
    for key in ("sarah", "alex", "yasmine"):
        for invitation in call("GET", "/invitations/me", token=tokens[key]):
            call("POST", f"/invitations/{invitation['id']}/accept", token=tokens[key])
    for title, status, priority, who, days in tasks:
        call("POST", f"/projects/{project['id']}/tasks",
             {"title": title, "status": status, "priority": priority,
              "assigneeId": ids[who], "dueDate": due(days)}, tokens["you"])
    print(f"{name}: {len(tasks)} tasks")

print("stats:", call("GET", "/dashboard/stats", token=tokens["you"]))
print(f"log in as {USERS['you'][1]} (password in this file)")
