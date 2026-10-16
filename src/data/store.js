const seededAt = new Date().toISOString()

let projects = [
  {
    id: 1,
    name: 'Expense Splitter',
    description: 'Split shared costs between friends and track who owes what.',
    created_at: seededAt,
    updated_at: seededAt,
  },
  {
    id: 2,
    name: 'Anime Roulette Watchlist',
    description:
      'Spin a roulette to pick a random show and save it to a watchlist.',
    created_at: seededAt,
    updated_at: seededAt,
  },
]

let nextProjectId = 3

function clone(item) {
  return { ...item }
}

function nowIso() {
  return new Date().toISOString()
}

export function listProjects() {
  return projects.map(clone)
}

export function getProjectById(id) {
  const project = projects.find((item) => item.id === id)
  return project ? clone(project) : null
}

export function createProject(input) {
  const timestamp = nowIso()
  const project = {
    id: nextProjectId,
    name: input.name.trim(),
    description: input.description?.trim() || '',
    created_at: timestamp,
    updated_at: timestamp,
  }

  nextProjectId += 1
  projects.push(project)

  return clone(project)
}

export function updateProject(id, input) {
  const index = projects.findIndex((item) => item.id === id)

  if (index === -1) {
    return null
  }

  const current = projects[index]
  const updated = {
    ...current,
    ...('name' in input ? { name: input.name.trim() } : {}),
    ...('description' in input
      ? { description: input.description.trim() }
      : {}),
    updated_at: nowIso(),
  }

  projects[index] = updated
  return clone(updated)
}

export function deleteProject(id) {
  const startSize = projects.length
  projects = projects.filter((item) => item.id !== id)

  if (projects.length === startSize) {
    return false
  }

  return true
}
