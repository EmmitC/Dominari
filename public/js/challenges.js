async function loadChallenges() {
  try {
    const response = await fetch('../json/challenges.json');
    if (!response.ok) throw new Error('Failed to load challenges.json');

    const data = await response.json();

    renderProgress(data.progress);
    renderBadges(data.badges);
    renderChallenges(data.challenges);

  } catch (error) {
    console.error('Error loading challenges:', error);
    document.getElementById('challenges').innerHTML = `<p class="text-center text-text-secondary">Unable to load challenges right now.</p>`;
  }
}

function renderProgress(progress) {
  document.querySelector('[data-progress-books]').innerHTML = `
    <div class="flex items-center justify-between mb-2">
      <span class="font-cta font-medium text-primary">Books Read</span>
      <span class="text-accent font-cta font-bold">${progress.booksRead.current}/${progress.booksRead.goal}</span>
    </div>
    <div class="w-full bg-primary-200 rounded-full h-3">
      <div class="bg-accent h-3 rounded-full" style="width: ${(progress.booksRead.current / progress.booksRead.goal) * 100}%"></div>
    </div>
  `;

  document.querySelector('[data-progress-genres]').innerHTML = `
    <div class="flex items-center justify-between mb-2">
      <span class="font-cta font-medium text-primary">Genres Explored</span>
      <span class="text-secondary font-cta font-bold">${progress.genresExplored.current}/${progress.genresExplored.goal}</span>
    </div>
    <div class="w-full bg-primary-200 rounded-full h-3">
      <div class="bg-secondary h-3 rounded-full" style="width: ${(progress.genresExplored.current / progress.genresExplored.goal) * 100}%"></div>
    </div>
  `;

  document.querySelector('[data-progress-pages]').innerHTML = `
    <div class="flex items-center justify-between mb-2">
      <span class="font-cta font-medium text-primary">Pages Read</span>
      <span class="text-success font-cta font-bold">${progress.pagesRead.current.toLocaleString()}</span>
    </div>
    <div class="w-full bg-primary-200 rounded-full h-3">
      <div class="bg-success h-3 rounded-full" style="width: ${(progress.pagesRead.current / progress.pagesRead.goal) * 100}%"></div>
    </div>
  `;
}

function renderBadges(badges) {
  const container = document.querySelector('[data-badges]');
  container.innerHTML = badges.map(badge => `
    <div class="text-center">
      <div class="w-16 h-16 bg-${badge.color}-100 rounded-full flex items-center justify-center mx-auto mb-2">
        ${renderBadgeIcon(badge.icon, badge.color)}
      </div>
      <div class="text-xs font-cta font-medium text-primary">${badge.title}</div>
    </div>
  `).join('');
}

function renderBadgeIcon(icon, color) {
  switch(icon) {
    case 'star': return `<svg class="w-8 h-8 text-${color}" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"/></svg>`;
    case 'check-circle': return `<svg class="w-8 h-8 text-${color}" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/></svg>`;
    case 'thumbs-up': return `<svg class="w-8 h-8 text-${color}" fill="currentColor" viewBox="0 0 20 20"><path d="M2 10.5a1.5 1.5 0 113 0v6a1.5 1.5 0 01-3 0v-6zM6 10.333v5.43a2 2 0 001.106 1.79l.05.025A4 4 0 008.943 18h5.416a2 2 0 001.962-1.608l1.2-6A2 2 0 0015.56 8H12V4a2 2 0 00-2-2 1 1 0 00-1 1v.667a4 4 0 01-.8 2.4L6.8 7.933a4 4 0 00-.8 2.4z"/></svg>`;
    default: return '';
  }
}

function renderChallenges(challenges) {
  const container = document.querySelector('[data-challenge-cards]');
  container.innerHTML = challenges.map(challenge => `
    <div class="bg-white rounded-2xl p-6 literary-shadow hover:literary-shadow-prominent literary-transition">
      <div class="flex items-center justify-between mb-4">
        <h4 class="text-xl font-display font-bold text-primary">${challenge.title}</h4>
        <span class="bg-${challenge.statusColor} text-white px-3 py-1 rounded-full text-sm font-cta font-medium">${challenge.status}</span>
      </div>
      <p class="text-text-secondary mb-4">${challenge.description}</p>
      <div class="flex items-center justify-between">
        <div class="text-sm text-text-secondary">${challenge.participants.toLocaleString()} participants</div>
        <button class="bg-${challenge.buttonColor} text-white px-6 py-2 rounded-lg font-cta font-medium hover:bg-${challenge.buttonColor}-700 literary-transition">
          Join Challenge
        </button>
      </div>
    </div>
  `).join('');
}

document.addEventListener('DOMContentLoaded', loadChallenges);
