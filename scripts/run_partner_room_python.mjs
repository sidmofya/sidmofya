#!/usr/bin/env node

import { execFile, spawn } from "node:child_process";
import { fileURLToPath } from "node:url";
import path from "node:path";
import { promisify } from "node:util";

const execFileAsync = promisify(execFile);
const requiredImports = "import reportlab, pypdf, pdfplumber";

function unique(values) {
  return [...new Set(values.filter(Boolean))];
}

export function pythonInterpreterCandidates({
  env = process.env,
  platform = process.platform,
} = {}) {
  const override =
    env.PARTNER_ROOM_PYTHON?.trim() || env.PYTHON_PATH?.trim();
  if (override) {
    return [override];
  }

  const pathApi = platform === "win32" ? path.win32 : path.posix;
  const homeDirectories = unique(
    platform === "win32"
      ? [env.USERPROFILE, env.HOME]
      : [env.HOME, env.USERPROFILE],
  );
  const bundledRoot = [
    ".cache",
    "codex-runtimes",
    "codex-primary-runtime",
    "dependencies",
    "python",
  ];
  const bundledCandidates = homeDirectories.flatMap((homeDirectory) => {
    if (platform === "win32") {
      return [pathApi.join(homeDirectory, ...bundledRoot, "python.exe")];
    }
    return [
      pathApi.join(homeDirectory, ...bundledRoot, "bin", "python3"),
      pathApi.join(homeDirectory, ...bundledRoot, "bin", "python"),
      pathApi.join(homeDirectory, ...bundledRoot, "python3"),
      pathApi.join(homeDirectory, ...bundledRoot, "python"),
    ];
  });

  return unique([...bundledCandidates, "python3", "python"]);
}

async function probePythonInterpreter(candidate) {
  try {
    await execFileAsync(candidate, ["-c", requiredImports], {
      timeout: 10_000,
      windowsHide: true,
    });
    return true;
  } catch {
    return false;
  }
}

export async function resolvePythonInterpreter({
  env = process.env,
  platform = process.platform,
  probe = probePythonInterpreter,
} = {}) {
  const candidates = pythonInterpreterCandidates({ env, platform });
  for (const candidate of candidates) {
    if (await probe(candidate)) {
      return candidate;
    }
  }

  throw new Error(
    [
      "No usable Python interpreter was found with reportlab, pypdf, and pdfplumber.",
      "Set PARTNER_ROOM_PYTHON (or PYTHON_PATH) to a suitable Python executable,",
      "or install the required packages with:",
      "  python -m pip install reportlab pypdf pdfplumber",
      `Tried: ${candidates.join(", ")}`,
    ].join("\n"),
  );
}

async function runPython(interpreter, args) {
  return new Promise((resolve, reject) => {
    const child = spawn(interpreter, args, { stdio: "inherit", windowsHide: true });
    child.once("error", reject);
    child.once("exit", (code, signal) => {
      if (signal) {
        reject(new Error(`Python process terminated by signal ${signal}.`));
        return;
      }
      resolve(code ?? 1);
    });
  });
}

async function main() {
  const pythonArgs = process.argv.slice(2);
  if (pythonArgs.length === 0) {
    throw new Error(
      "Usage: node scripts/run_partner_room_python.mjs <script.py> [arguments...]",
    );
  }
  const interpreter = await resolvePythonInterpreter();
  process.exitCode = await runPython(interpreter, pythonArgs);
}

const isMain =
  process.argv[1] &&
  path.resolve(process.argv[1]) === path.resolve(fileURLToPath(import.meta.url));

if (isMain) {
  main().catch((error) => {
    console.error(error.message);
    process.exitCode = 1;
  });
}
