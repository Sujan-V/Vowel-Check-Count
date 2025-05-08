const input = document.getElementById("inputText");
const resultDiv = document.getElementById("result");
const ctx = document.getElementById('vowelChart');
let chart;

input.addEventListener("input", checkVowels);

function checkVowels() {
  const text = input.value;
  const vowels = { a: 0, e: 0, i: 0, o: 0, u: 0 };
  const highlighted = text.replace(/[aeiou]/gi, match =>
    `<span class="highlight-vowel">${match}</span>`
  );

  for (let char of text.toLowerCase()) {
    if (vowels.hasOwnProperty(char)) vowels[char]++;
  }

  resultDiv.innerHTML = `
    <strong>Vowel Counts:</strong><br>
    A: ${vowels.a} | E: ${vowels.e} | I: ${vowels.i} | O: ${vowels.o} | U: ${vowels.u}
    <hr><strong>Highlighted Text:</strong><br>${highlighted}
  `;

  updateChart(Object.values(vowels));
}

function updateChart(data) {
  if (chart) chart.destroy();
  chart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: ['A', 'E', 'I', 'O', 'U'],
      datasets: [{
        label: 'Vowel Count',
        data: data,
        backgroundColor: 'rgba(255, 99, 132, 0.5)'
      }]
    },
    options: {
      responsive: true,
      scales: {
        y: { beginAtZero: true }
      }
    }
  });
}

function startSpeech() {
  const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
  recognition.lang = 'en-US';
  recognition.interimResults = false;
  recognition.maxAlternatives = 1;

  recognition.onresult = function(event) {
    const speech = event.results[0][0].transcript;
    input.value += " " + speech;
    checkVowels();
  };
  recognition.start();
}

function toggleDarkMode() {
  document.body.classList.toggle("dark-mode");
}

function copyResult() {
  navigator.clipboard.writeText(resultDiv.innerText).then(() => {
    alert("Result copied to clipboard!");
  });
}

function saveToFile() {
  const blob = new Blob([resultDiv.innerText], { type: "text/plain;charset=utf-8" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = "vowel_report.txt";
  link.click();
}
