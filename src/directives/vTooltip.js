/**
 * Custom Tooltip Directive
 * Usage: <button v-tooltip="'Click me!'">Button</button>
 * or: <button v-tooltip="{ text: 'Click me!', position: 'top' }">Button</button>
 */

export const vTooltip = {
  mounted(el, binding) {
    let tooltipText = ''
    let position = 'top'

    // Handle both string and object bindings
    if (typeof binding.value === 'string') {
      tooltipText = binding.value
    } else if (typeof binding.value === 'object') {
      tooltipText = binding.value.text || ''
      position = binding.value.position || 'top'
    }

    // Create tooltip element
    const tooltip = document.createElement('div')
    tooltip.textContent = tooltipText
    tooltip.className = `custom-tooltip custom-tooltip-${position}`
    tooltip.style.cssText = `
      position: absolute;
      background-color: rgba(0, 0, 0, 0.9);
      color: white;
      padding: 8px 12px;
      border-radius: 6px;
      font-size: 14px;
      white-space: nowrap;
      pointer-events: none;
      opacity: 0;
      transition: opacity 0.2s;
      z-index: 1000;
      box-shadow: 0 2px 8px rgba(0,0,0,0.2);
    `

    // Store tooltip reference on element
    el._tooltip = tooltip

    // Show tooltip on hover
    el.addEventListener('mouseenter', () => {
      document.body.appendChild(tooltip)
      
      const rect = el.getBoundingClientRect()
      const tooltipRect = tooltip.getBoundingClientRect()

      // Position tooltip based on specified position
      switch (position) {
        case 'top':
          tooltip.style.left = rect.left + (rect.width / 2) - (tooltipRect.width / 2) + 'px'
          tooltip.style.top = rect.top - tooltipRect.height - 8 + window.scrollY + 'px'
          break
        case 'bottom':
          tooltip.style.left = rect.left + (rect.width / 2) - (tooltipRect.width / 2) + 'px'
          tooltip.style.top = rect.bottom + 8 + window.scrollY + 'px'
          break
        case 'left':
          tooltip.style.left = rect.left - tooltipRect.width - 8 + 'px'
          tooltip.style.top = rect.top + (rect.height / 2) - (tooltipRect.height / 2) + window.scrollY + 'px'
          break
        case 'right':
          tooltip.style.left = rect.right + 8 + 'px'
          tooltip.style.top = rect.top + (rect.height / 2) - (tooltipRect.height / 2) + window.scrollY + 'px'
          break
      }

      // Fade in
      setTimeout(() => {
        tooltip.style.opacity = '1'
      }, 10)
    })

    // Hide tooltip on mouse leave
    el.addEventListener('mouseleave', () => {
      tooltip.style.opacity = '0'
      setTimeout(() => {
        if (tooltip.parentNode) {
          document.body.removeChild(tooltip)
        }
      }, 200)
    })
  },

  updated(el, binding) {
    if (el._tooltip) {
      if (typeof binding.value === 'string') {
        el._tooltip.textContent = binding.value
      } else if (typeof binding.value === 'object') {
        el._tooltip.textContent = binding.value.text || ''
      }
    }
  },

  unmounted(el) {
    if (el._tooltip && el._tooltip.parentNode) {
      document.body.removeChild(el._tooltip)
    }
  }
}
