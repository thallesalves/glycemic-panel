;(function () {
  const STORAGE_KEY = 'glycemicPanel.entries'

  // --- Helpers de armazenamento ---
  function loadEntries() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      return raw ? JSON.parse(raw) : []
    } catch {
      return []
    }
  }
  function saveEntries(list) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list))
  }

  // --- Renderização da lista/tabela ---
  const entriesSection = document.getElementById('entries')
  function renderEntries(list) {
    entriesSection.innerHTML = '<h2>Entradas registradas</h2>'
    if (!list.length) {
      const p = document.createElement('p')
      p.textContent = 'Ainda não há entradas.'
      entriesSection.appendChild(p)
      return
    }

    const table = document.createElement('table')
    table.border = '1'
    table.cellPadding = '6'
    table.style.borderCollapse = 'collapse'

    const thead = document.createElement('thead')
    const headRow = document.createElement('tr')
    ;[
      'Data', 'Hora treino', 'Tipo', 'Duração (min)',
      'Pré', 'Durante', 'Pós',
      'Últ. refeição', 'Últ. insulina rápida',
      'Observações'
    ].forEach(h => {
      const th = document.createElement('th')
      th.textContent = h
      headRow.appendChild(th)
    })
    thead.appendChild(headRow)

    const tbody = document.createElement('tbody')
    list.forEach(e => {
      const tr = document.createElement('tr')
      const cells = [
        e.date || '',
        e.time || '',
        e.type || '',
        String(e.duration ?? ''),
        String(e.pre ?? ''),
        e.during == null ? '' : String(e.during),
        String(e.post ?? ''),
        e.lastMealTime || '',
        e.lastRapidInsulinTime || '',
        e.notes || ''
      ]
      cells.forEach(text => {
        const td = document.createElement('td')
        td.textContent = text // evita HTML injetado
        tr.appendChild(td)
      })
      tbody.appendChild(tr)
    })

    table.appendChild(thead)
    table.appendChild(tbody)
    entriesSection.appendChild(table)
  }

  // --- Captura do formulário e submit ---
  const form = document.getElementById('entry-form')
  function readFormData(f) {
    return {
      id: (crypto.randomUUID && crypto.randomUUID()) || String(Date.now()),
      date: f.date.value,
      time: f.time.value,
      type: f.type.value,
      duration: parseInt(f.duration.value, 10),
      pre: parseInt(f.pre.value, 10),
      during: f.during.value ? parseInt(f.during.value, 10) : null,
      post: parseInt(f.post.value, 10),
      lastMealTime: f.lastMealTime.value,
      lastRapidInsulinTime: f.lastRapidInsulinTime.value,
      notes: f.notes.value.trim(),
      createdAt: new Date().toISOString()
    }
  }

  form.addEventListener('submit', function (ev) {
    ev.preventDefault()
    // O HTML já faz validação básica (required/min/max)
    const entry = readFormData(form)
    const list = loadEntries()
    list.unshift(entry) // novo no topo
    saveEntries(list)
    form.reset()
    renderEntries(list)
  })

  // --- Inicialização ---
  document.addEventListener('DOMContentLoaded', () => {
    renderEntries(loadEntries())
  })
})()
