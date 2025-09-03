import type { Format, LogFile } from "electron-log"
import * as colorette from 'colorette';
import _ from "lodash";
import path from "path";

import fs from "fs";
import util from "util";
import { formatDateTimeStr } from "@common/utils/dateTime";

// @ts-ignore
export const consoleLogFormat: Format = ({ data, level, message }) => {
  const text = util.format(...data);

  const colorMap: Record<string, (v: string) => string> = {
    "error": _.flow([colorette.white, colorette.bgRed]),
    "info": _.flow([colorette.white, colorette.bgCyan]),
    "warn": _.flow([colorette.white, colorette.bgYellow]),
    "debug": colorette.gray,
    "verbose": colorette.gray,
    "silly": colorette.gray
  }
  const separator = process.platform === "win32" ? ">" : "›";
  const date = message.date as Date;
  const timeStr = formatDateTimeStr(date);

  const timeFormatter = _.flow([colorette.gray, colorette.italic])
  const scopeFormatter = _.flow([colorette.bold, colorette.gray, colorette.underline])

  return [
    colorMap[level](level),
    colorette.underline(message.variables!['processType']),
    timeFormatter(timeStr),
    scopeFormatter(`(${message.scope ?? "default"})`),
    colorette.gray(separator),
    text
  ];
}

export const rotateLogFile: (oldLogFile: LogFile) => void = (logPath) => {
  // custom log rotation here
  const file = logPath.toString();
  const info = path.parse(file);

  const fileName = `${info.name}-old-${Date.now()}.${info.ext}`;

  try {
    fs.renameSync(file, path.join(info.dir, fileName));
  } catch (e) {
    console.warn("Could not rotate log", e);
  }
}