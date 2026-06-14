/**
 * Zero-compile template engine for dynamic variable interpolation, loops, and conditionals.
 * Supports {{variable}}, {{#each list}}, and {{#if key}}...{{else}}...{{/if}} with nesting.
 */

/**
 * Resolve {{#if key}}...{{else}}...{{/if}} blocks against a context, with
 * balanced matching so nested conditionals do not truncate outer blocks.
 */
function processConditionals(template: string, context: Record<string, any>): string {
  const openRe = /\{\{#if (\w+)\}\}/;
  let result = template;
  let match: RegExpExecArray | null;

  while ((match = openRe.exec(result))) {
    const start = match.index;
    const innerStart = start + match[0].length;

    // Scan forward tracking nesting depth to find the matching {{/if}} and a
    // depth-1 {{else}} divider if present.
    const tokenRe = /\{\{#if \w+\}\}|\{\{\/if\}\}|\{\{else\}\}/g;
    tokenRe.lastIndex = innerStart;
    let depth = 1;
    let elseIndex = -1;
    let endIndex = -1;
    let endTokenLength = 0;
    let token: RegExpExecArray | null;

    while ((token = tokenRe.exec(result))) {
      if (token[0].startsWith('{{#if')) {
        depth++;
      } else if (token[0] === '{{/if}}') {
        depth--;
        if (depth === 0) {
          endIndex = token.index;
          endTokenLength = token[0].length;
          break;
        }
      } else if (token[0] === '{{else}}' && depth === 1) {
        elseIndex = token.index;
      }
    }

    // Unbalanced template: leave the remainder untouched rather than looping forever
    if (endIndex === -1) break;

    const truthyBranch = result.slice(innerStart, elseIndex === -1 ? endIndex : elseIndex);
    const falsyBranch = elseIndex === -1 ? '' : result.slice(elseIndex + '{{else}}'.length, endIndex);

    const value = context[match[1]];
    const isTruthy = value && (Array.isArray(value) ? value.length > 0 : true);
    const chosenBranch = processConditionals(isTruthy ? truthyBranch : falsyBranch, context);

    result = result.slice(0, start) + chosenBranch + result.slice(endIndex + endTokenLength);
  }

  return result;
}

/** Interpolate {{variable}} placeholders from a context. */
function processVariables(template: string, context: Record<string, any>): string {
  return template.replace(/\{\{(\w+)\}\}/g, (match, key) => {
    return context[key] !== undefined ? String(context[key]) : '';
  });
}

export function renderTemplate(template: string, data: Record<string, any>): string {
  let rendered = template;

  // Strip Handlebars-style comments: {{!-- comment --}} and {{! comment }}
  rendered = rendered.replace(/\{\{!--[\s\S]*?--\}\}/g, '')
                     .replace(/\{\{![\s\S]*?\}\}/g, '');

  // 1. Parse Loops: {{#each listKey}} ... {{/each}}
  rendered = rendered.replace(/\{\{#each (\w+)\}\}([\s\S]*?)\{\{\/each\}\}/g, (match, listKey, loopTemplate) => {
    const list = data[listKey];
    if (!Array.isArray(list)) return '';

    return list.map((item) => {
      // Resolve conditionals and variables inside the local loop context
      return processVariables(processConditionals(loopTemplate, item), item);
    }).join('\n');
  });

  // 2. Parse Conditionals: {{#if key}} ... {{else}} ... {{/if}} (nesting supported)
  rendered = processConditionals(rendered, data);

  // 3. Parse Standard Variables: {{variable}}
  rendered = processVariables(rendered, data);

  return rendered;
}
