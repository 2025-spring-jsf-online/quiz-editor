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
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'quiz-editor';
  quizzes: QuizDisplay[] = [];

  selectedQuiz?: QuizDisplay;

  constructor(public quizSvc: QuizService) {}

  ngOnInit() {
    const quizzes = this.quizSvc.loadQuizzes();

    this.quizzes = quizzes.map(x => ({
      quizName: x.name,
      quizQuestions: x.questions.map((y: any) => ({
        questionName: y.name
      })),
      markedForDelete: false
    }));
  }

  selectQuiz(quiz: QuizDisplay) {
    this.selectedQuiz = quiz;
  }

  addNewQuiz() {
    const newQuiz: QuizDisplay = {
      quizName: 'Untitled Quiz',
      quizQuestions: [],
      markedForDelete: false
    };

    this.quizzes.push(newQuiz);
    this.selectQuiz(newQuiz);
  }
}