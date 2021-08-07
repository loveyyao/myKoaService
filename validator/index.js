module.exports = (data, rules) => {
  const rulesKey = Object.keys(rules)
  const errorList = []
  for (let i = 0; i < rulesKey.length; i++) {
    const ruleList = rules[rulesKey[i]]
    const value = data[rulesKey[i]]
    for (let j = 0; j < ruleList.length; j++) {
      const rule = ruleList[j]
      if (rule.required && !value) {
        errorList.push({
          key: rulesKey[i],
          message: rule.message
        })
        break
      }
      if (rule.min && rule.max) {
        const valLength = value.length
        if (valLength < rule.min) {
          errorList.push({
            key: rulesKey[i],
            message: rule.message
          })
          break
        }
        if (valLength > rule.max) {
          errorList.push({
            key: rulesKey[i],
            message: rule.message
          })
          break
        }
      }
      if (rule.validator && typeof rule.validator === 'function') {
        const result = rule.validator(value)
        if (!result.valid) {
          errorList.push({
            key: rulesKey[i],
            message: result.message
          })
          break
        }
      }
    }
    if (errorList.length) {
      break
    }
  }
  return errorList
}
