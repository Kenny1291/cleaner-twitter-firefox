(async () => {
  const CSSRules = await chrome.storage.sync.get().then(result => {
    return result.CSSRulesArrayOfObjectsWithNames
  })

  const h2 = document.querySelector('h2')

  CSSRules.forEach(CSSRule => {
    const toggleName = CSSRule.name
      .split('_')
      .map(word => word[0].toUpperCase() + word.slice(1))
      .join(' ')

    h2.insertAdjacentHTML(
      'afterend',
      `
      <div class="switch-container">
        <label for=${CSSRule.name}>${toggleName}</label>
        <input id=${CSSRule.name} type="checkbox" />
      </div>
    `
    )

    const ruleToggle = document.getElementById(CSSRule.name)

    //set toggles based on storage keys values the first time
    ruleToggle.checked = CSSRule.active

    ruleToggle.addEventListener('click', function () {
      toggleStorageKey(CSSRule.name)
    })
  })
  function toggleStorageKey(CSSRuleName) {
    chrome.storage.sync.get().then(result => {
      const CSSRules = result.CSSRulesArrayOfObjectsWithNames
      const CSSRule = CSSRules.find(rule => rule.name === CSSRuleName)
      CSSRule.active = !CSSRule.active
      chrome.storage.sync.set({ CSSRulesArrayOfObjectsWithNames: CSSRules })
    })
  }
  const editCSSRulesButton = document.getElementById('editCSSRules')
  editCSSRulesButton.addEventListener('click', () => {
    window.open(chrome.runtime.getURL('options/options.html'))
  })
  const hasTwitterPermission = await browser.permissions.contains({ origins: ["https://*.twitter.com/*"] })
  if(!hasTwitterPermission) {
    editCSSRulesButton.insertAdjacentHTML(
      'afterend',
      `<p style="font-size: 10px;">Enable the optional permission for this extension <br> "Access your data for sites in the https://twitter.com domain" <br> to avoid open the popup every time.</p>`
    )
  }
})()