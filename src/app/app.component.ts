import { Component, OnInit } from '@angular/core';
import { QuizService } from './quiz.service';

interface QuizDisplay {
  quizName: string;
  quizQuestions: QuestionDisplay[];
  markedForDelete: boolean;
}

interface QuestionDisplay {
  questionName: string;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  standalone: false,
  styleUrl: './app.component.css',
})
export class AppComponent implements OnInit {
  title = 'quiz-editor';

  constructor(public quizSvc: QuizService) {}

  ngOnInit(): void {
    const quizzes = this.quizSvc.loadQuizzes();
    console.log(quizzes);

    quizzes.subscribe(
      (data) => {
        console.log(data);

        this.quizzes = data.map((x) => ({
          quizName: x.name,
          quizQuestions: x.questions.map((y) => ({
            questionName: y.name,
          })),
          markedForDelete: false,
        }));
      },
      (err) => {
        console.error(err);
      }
    );
  }

  quizzes: QuizDisplay[] = [];

  selectedQuiz: QuizDisplay | undefined = undefined;

  selectQuiz = (q: QuizDisplay) => {
    this.selectedQuiz = q;

    console.log(this.selectedQuiz);
  };

  addNewQuiz = () => {
    const newQuiz = {
      quizName: ' Untitled Quiz',
      quizQuestions: [],
      markedForDelete: false,
    };

    this.quizzes = [...this.quizzes, newQuiz];

    this.selectedQuiz = newQuiz;
  };

  addNewQuestion = () => {
    if (this.selectedQuiz) {
      this.selectedQuiz.quizQuestions = [
        ...this.selectedQuiz.quizQuestions,
        {
          questionName: 'Untitiled Question',
        },
      ];
    }
  };

  removeQuestion = (questionToRemove: QuestionDisplay) => {
    if (this.selectedQuiz) {
      this.selectedQuiz.quizQuestions = this.selectedQuiz.quizQuestions.filter(
        (x) => x !== questionToRemove
      );
    }
  };
}
