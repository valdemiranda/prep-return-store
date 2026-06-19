import type * as React from "react";
import { renderToStaticMarkup } from "react-dom/server";

const doctype =
  '<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">';

export function renderEmail(template: React.ReactElement) {
  return `${doctype}${renderToStaticMarkup(template)}`;
}
