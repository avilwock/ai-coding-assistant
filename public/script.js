document.addEventListener('DOMContentLoaded', () => {
  const questionInput = document.getElementById('questionInput');
  const askBtn = document.getElementById('askBtn');
  const answerOutput = document.getElementById('answerOutput');

  async function askQuestion() {
    const question = questionInput.value.trim();
    if (!question) return;

    answerOutput.textContent = 'Thinking...';

    try {
      const response = await fetch('/ask', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ question })
      });

      const data = await response.json();
      answerOutput.textContent = data.result || 'No answer returned.';
    } catch (err) {
      console.error(err);
      answerOutput.textContent = 'Error contacting Server.';
    }
  }

  // Button click
  askBtn.addEventListener('click', askQuestion);

  // Enter key
  questionInput.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
      askQuestion();
    }
  });
});
