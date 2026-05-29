/**
 * Zero-compile template engine for dynamic variable interpolation, loops, and conditionals.
 */
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
      let itemHtml = loopTemplate;
      
      // Process local conditionals inside the loop context first
      itemHtml = itemHtml.replace(/\{\{#if (\w+)\}\}([\s\S]*?)\{\{\/if\}\}/g, (m, key, content) => {
        const isTruthy = item[key] && (Array.isArray(item[key]) ? item[key].length > 0 : true);
        return isTruthy ? content : '';
      });

      // Interpolate item properties inside the loop
      itemHtml = itemHtml.replace(/\{\{(\w+)\}\}/g, (m, key) => {
        return item[key] !== undefined ? String(item[key]) : '';
      });
      return itemHtml;
    }).join('\n');
  });

  // 2. Parse Conditionals: {{#if key}} ... {{/if}}
  rendered = rendered.replace(/\{\{#if (\w+)\}\}([\s\S]*?)\{\{\/if\}\}/g, (match, key, content) => {
    // If key is present and truthy, render content. Else render empty string.
    const isTruthy = data[key] && (Array.isArray(data[key]) ? data[key].length > 0 : true);
    return isTruthy ? content : '';
  });

  // 3. Parse Standard Variables: {{variable}}
  rendered = rendered.replace(/\{\{(\w+)\}\}/g, (match, key) => {
    return data[key] !== undefined ? String(data[key]) : '';
  });

  return rendered;
}
