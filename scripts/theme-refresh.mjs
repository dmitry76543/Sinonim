import fs from "fs";
import path from "path";

const reps = [
  ["hover:bg-brand-olive-dark", "hover:bg-brand-terracotta-logo"],
  ["bg-brand-olive hover:bg-brand-terracotta-logo", "bg-brand-terracotta hover:bg-brand-terracotta-logo"],
  ["rounded-lg bg-brand-olive", "rounded-lg bg-brand-terracotta"],
  ["inline-flex bg-brand-olive", "inline-flex bg-brand-terracotta"],
  ["shrink-0 rounded-lg bg-brand-olive", "shrink-0 rounded-lg bg-brand-terracotta"],
  ["bg-brand-olive px", "bg-brand-terracotta px"],
  ["bg-brand-olive text", "bg-brand-terracotta text"],
  ["bg-brand-olive border", "bg-brand-terracotta border"],
  ["hover:bg-brand-olive hover:text-white", "hover:bg-brand-text hover:text-white"],
  ["hover:text-brand-olive", "hover:text-brand-terracotta"],
  ["text-brand-olive underline", "text-brand-terracotta underline"],
  ["text-brand-olive hover:", "text-brand-terracotta hover:"],
  ["text-brand-olive text-sm", "text-brand-terracotta text-sm"],
  ["text-brand-olive transition", "text-brand-terracotta transition"],
  ["text-brand-olive mb", "text-brand-terracotta mb"],
  ["bg-brand-olive-dark text-white", "bg-white text-brand-text border-y border-brand-sand"],
  ["overflow-hidden bg-brand-olive-dark", "overflow-hidden bg-white border-b border-brand-sand"],
  ["relative overflow-hidden bg-brand-olive-dark", "relative overflow-hidden bg-white"],
  ["bg-brand-olive/10", "bg-brand-sand/60"],
  ["bg-brand-olive/5", "bg-brand-sand/40"],
  ["border-brand-olive bg-brand-terracotta/10", "border-brand-terracotta bg-brand-terracotta/10"],
  ["text-brand-sand/90", "text-brand-terracotta"],
  ["text-brand-sand mb", "text-brand-olive-dark mb"],
  ["text-brand-sand hover", "text-brand-terracotta hover"],
  ["text-white/80", "text-brand-muted"],
  ["text-white/85", "text-brand-muted"],
  ["text-white/70", "text-brand-muted"],
  ["text-white/60", "text-brand-muted"],
  ["border-white/15 bg-white/5", "border-brand-sand bg-brand-surface"],
  ["border-white/25 text-brand-sand", "border-brand-sand text-brand-text"],
  ["bg-brand-sand/20", "bg-brand-surface"],
  ["bg-brand-sand/30", "bg-brand-surface"],
  ["bg-brand-sand/40", "bg-brand-surface"],
  ["bg-brand-sand/50", "bg-brand-surface"],
  ["bg-brand-sand/60", "bg-brand-surface"],
];

function walk(dir) {
  for (const file of fs.readdirSync(dir)) {
    const full = path.join(dir, file);
    if (fs.statSync(full).isDirectory()) {
      walk(full);
      continue;
    }
    if (!file.endsWith(".tsx")) continue;

    let content = fs.readFileSync(full, "utf8");
    let next = content;
    for (const [from, to] of reps) {
      next = next.split(from).join(to);
    }
    if (next !== content) {
      fs.writeFileSync(full, next);
      console.log("updated", full);
    }
  }
}

walk("src");
