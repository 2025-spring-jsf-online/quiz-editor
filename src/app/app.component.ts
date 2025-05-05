import { Component, OnInit } from '@angular/core';
import { QuizService } from './quiz.service';

interface QuizDisplay {
  quizName: string;
  quizQuestions: QuestionDisplay[];
}

interface QuestionDisplay {
  questionName: string;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  standalone: false,
  styleUrls: ['./app.component.css'] // <-- fixed here
})
export class AppComponent implements OnInit {
  title = 'quiz-editor';
  quizzes: QuizDisplay[] = [];

  constructor(public quizSvc: QuizService) {}

  ngOnInit() {
    const quizzes = this.quizSvc.loadQuizzes();
    console.log(quizzes);

    this.quizzes = quizzes.map((x: any) => ({
      quizName: x.name,
      quizQuestions: x.questions.map((y: any) => ({
        questionName: y.name
      }))
    }));

    console.log(this.quizzes);
  }
}
