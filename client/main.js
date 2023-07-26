document.addEventListener('DOMContentLoaded', () => {
   const addEvent = document.querySelector('.btn');
   addEvent.addEventListener('click', () => {
      fetch('/questions')
         .then(response => response.json())
         .then(questions => {
            const questionsContainer = document.querySelector('.questions');
            // Для кожного питання створюємо відповідні елементи форми
            questions.forEach((question, index) => {
               const questionElement = document.createElement('div');
               questionElement.className = 'questions__form';
               questionElement.innerHTML = `
                  <p>Питання ${index + 1}: ${question.caption}</p>
                  <input type="radio" name="answer_${index}" value="true"> Так
                  <input type="radio" name="answer_${index}" value="false"> Ні
               `;
               questionsContainer.appendChild(questionElement);
            });

            // Включаємо кнопку "Перевірити" після того, як всі відповіді проставлені
            const checkButton = document.querySelector('.check-button');
            const answerInputs = document.querySelectorAll('input[type="radio"]');
            answerInputs.forEach(input => {
               input.addEventListener('change', () => {
                  const allAnswersSelected = Array.from(answerInputs).every(input => input.checked);
                  checkButton.disabled = allAnswersSelected;
               });
            });

            // Обробка натискання на кнопку "Перевірити"
            checkButton.addEventListener('click', () => {
               const answers = Array.from(answerInputs).map(input => input.checked);
               const requestOptions = {
                  method: 'POST',
                  headers: {
                     'Content-Type': 'application/json'
                  },
                  body: JSON.stringify(answers)
               };

               fetch('/check', requestOptions)
                  .then(response => response.json())
                  .then(result => {
                     alert(`Ваш результат: ${result.score} правильних відповідей з ${questions.length}`);
                  })
                  .catch(error => {
                     console.error('Помилка під час перевірки відповідей:', error);
                  });
            });
         })
         .catch(error => {
            console.error('Помилка під час отримання питань з сервера:', error);
         });
   });
});