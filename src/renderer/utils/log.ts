import type { Format } from "electron-log";
import _ from "lodash";
import { formatDateTimeStr } from "@common/utils/dateTime";

// @ts-ignore
export const consoleLogFormat: Format = ({ data, level, message }) => {
  const { scope, date } = message;

  const commonBgStyle = "padding: 2px 4px; border-radius: 4px;";
  const commonTextStyle = "font-weight: bold; font-family: monospace;";

  // 为不同日志级别设定颜色映射
  const colorMap: Record<string, string> = {
    "error": `color: white; background-color: red; ${commonBgStyle} ${commonTextStyle}`,
    "info": `color: white; background-color: #007bff; ${commonBgStyle} ${commonTextStyle}`,
    "warn": `color: white; background-color: yellow; ${commonBgStyle} ${commonTextStyle}`,
    "debug": "color: gray;",
    "verbose": "color: gray;",
    "silly": `color: gray; ${commonBgStyle} ${commonTextStyle}`
  };

  // 设置不同平台的分隔符
  const separator = "›";

  // 格式化时间戳
  const timeStr = formatDateTimeStr(date);

  // 设置时间、作用域和日志级别的样式
  const timeStyle = "color: gray; font-family: monospace;";
  const scopeStyle = "font-weight: bold; color: gray; text-decoration: underline; font-family: monospace;";
  const separatorStyle = "color: gray; font-family: monospace;";
  const unsetStyle = "font-family: monospace;";

  // 返回格式化后的日志信息数组
  return [
    `%c${level}%c ${timeStr} %c(${scope ?? "default"})%c ${separator}`,
    colorMap[level],
    timeStyle,
    scopeStyle,
    separatorStyle,
    ...data
  ];
};