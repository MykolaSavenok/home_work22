import fastify from 'fastify';
import fastifyStatic from '@fastify/static';
import path from 'path';
import { fileURLToPath } from 'url';

const server = fastify();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const questions = [
   {
      caption: 'Подія натискання на елемент називається click?',
      correctAnswer: true
   },
   {
      caption: 'Усередині розмітки не можна додати обробник події?',
      correctAnswer: false
   },
   {
      caption: 'Припинити спливання події можна за допомогою метода stopImmediatePropagation?',
      correctAnswer: false
   },
   {
      caption: 'Припинити спливання події можна за допомогою метода stopPropagation?',
      correctAnswer: true
   }
];

server.register(fastifyStatic, {
   root: path.join(__dirname, '../client'),
   prefix: '/'
});

server.get('/questions', (request, reply) => {
   return reply.send(questions);
});

server.post('/check', (request, reply) => {
   const userAnswers = request.body;

   // Перевіряємо правильність відповідей та рахуємо кількість правильних
   let score = 0;
   for (let i = 0; i < questions.length; i++) {
      if (userAnswers[i] === questions[i].correctAnswer) {
         score++;
      }
   }

   const result = {
      score: score,
      totalQuestions: questions.length
   };

   reply.send(result);
});

server.listen({ port: 5556 })
   .then(() => {
      console.log('Server started');
   })
   .catch((error) => {
      console.log('Error', error);
   });