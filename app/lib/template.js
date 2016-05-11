export default class Template {
  static compile (text, variables) {
    return text.replace(/\{[^}]+\}/g, (item) => {
      const key = item.slice(1, -1)
      return variables[key] || item
    })
  }
}
