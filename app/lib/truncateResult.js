const truncate = (text, length) => (!text || !text.length || text.length < length) ? text : `${text.substring(0, length)}... (${text.length - length} more bytes)`
const truncateResult = (result) => Object.assign({}, result, { preview: truncate(result.preview, 1024) })

module.exports = truncateResult
