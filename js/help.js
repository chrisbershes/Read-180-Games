(function () {
  const HELP = {
    menu: {
      title: 'How to use Game Center',
      body: 'Choose a game card to start playing. Sign in with Google to save your progress to the cloud. Click your name in the top-right to open your account menu.',
      tips: ['Word Builder: build vocabulary words from the letter choices.', 'Word Match: match each word to its meaning.', 'Story Quest: read the story and answer the questions.']
    },
    'word-builder': {
      title: 'How to play Word Builder',
      body: 'Read the definition, then click the letters in the correct order to build the vocabulary word.',
      tips: ['One correct letter is blocked each round. Use Unlock Letter when you need it.', 'Click Clear if you want to start your answer again.', 'Finish the challenge to earn XP and build your streak.']
    },
    'word-match': {
      title: 'How to play Word Match',
      body: 'Choose a word, then choose the meaning that matches it. Keep matching until the round is complete.',
      tips: ['Choose the meaning that best fits the word.', 'Correct matches earn XP.', 'Use the speaker button to hear the instructions.']
    },
    'story-quest': {
      title: 'How to play Story Quest',
      body: 'Read the story carefully, then choose the answer that best matches what you read.',
      tips: ['After a few seconds the story can enter Memory Fog. Use Review Story when you need to see it again.', 'Correct answers earn XP.', 'Use the speaker button to hear the story aloud.']
    }
  };

  function pageKey() {
    const path = location.pathname.toLowerCase();
    if (path.endsWith('/word-builder.html')) return 'word-builder';
    if (path.endsWith('/word-match.html')) return 'word-match';
    if (path.endsWith('/story-quest.html')) return 'story-quest';
    return 'menu';
  }

  function ensureModal() {
    if (document.getElementById('helpModal')) return document.getElementById('helpModal');
    const modal = document.createElement('div');
    modal.id = 'helpModal';
    modal.className = 'help-modal-backdrop';
    modal.hidden = true;
    modal.innerHTML = `
      <section class="help-modal" role="dialog" aria-modal="true" aria-labelledby="helpTitle">
        <button class="help-close" id="helpClose" type="button" aria-label="Close help">×</button>
        <div class="help-icon">?</div>
        <p class="crumb">HELP</p>
        <h2 id="helpTitle"></h2>
        <p id="helpBody" class="help-body"></p>
        <ul id="helpTips" class="help-tips"></ul>
        <button class="help-done" id="helpDone" type="button">Got it</button>
      </section>`;
    document.body.appendChild(modal);
    const close = () => {
      modal.hidden = true;
      document.body.classList.remove('help-open');
    };
    document.getElementById('helpClose').addEventListener('click', close);
    document.getElementById('helpDone').addEventListener('click', close);
    modal.addEventListener('click', e => { if (e.target === modal) close(); });
    document.addEventListener('keydown', e => { if (e.key === 'Escape' && !modal.hidden) close(); });
    return modal;
  }

  function openHelp() {
    const modal = ensureModal();
    const content = HELP[pageKey()];
    document.getElementById('helpTitle').textContent = content.title;
    document.getElementById('helpBody').textContent = content.body;
    const list = document.getElementById('helpTips');
    list.innerHTML = content.tips.map(t => `<li>${t}</li>`).join('');
    modal.hidden = false;
    document.body.classList.add('help-open');
    document.getElementById('helpDone').focus();
  }

  document.addEventListener('DOMContentLoaded', () => {
    const buttons = document.querySelectorAll('.help-button, .round-btn');
    buttons.forEach(btn => {
      btn.classList.add('help-button');
      btn.setAttribute('aria-label', 'Open help');
      btn.addEventListener('click', openHelp);
    });
  });
})();
