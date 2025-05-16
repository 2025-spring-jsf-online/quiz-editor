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
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  title = 'quiz-editor';

  constructor(public quizSvc: QuizService) {}

  errorLoadingQuizzes = false;

  loadQuizzesFromCloud = async () => {
    try {
      const quizzes = (await this.quizSvc.loadQuizzes()) ?? [];
      console.log(quizzes);

      this.quizzes = quizzes.map((x) => ({
        quizName: x.name,
        quizQuestions: x.questions.map((y) => ({
          questionName: y.name,
        })),
        markedForDelete: false,
      }));
    } catch (err) {
      console.error(err);
      this.errorLoadingQuizzes = true;
    }
  };

  ngOnInit() {
    this.loadQuizzesFromCloud();

    // const quizzes = this.quizSvc.loadQuizzes();
    // console.log(quizzes);

    // quizzes.subscribe({
    //   next: (data) => {
    //     console.log(data);
    //     this.quizzes = data.map((x) => ({
    //       quizName: x.name,
    //       quizQuestions: x.questions.map((y) => ({
    //         questionName: y.name,
    //       })),
    //       markedForDelete: false,
    //     }));
    //   },
    //   error: (err) => {
    //     console.error(err.error);
    //     this.errorLoadingQuizzes = true;
    //   },
    // });

    // this.quizzes = quizzes.map(x => ({
    //   quizName: x.name
    //   , quizQuestions: x.questions.map((y: any) => ({
    //     questionName: y.name
    //   }))
    //   , markedForDelete: false
    // }));

    // console.log(this.quizzes);
  }

  quizzes: QuizDisplay[] = [];

  selectedQuiz: QuizDisplay | undefined = undefined;

  selectQuiz = (q: QuizDisplay) => {
    this.selectedQuiz = q;
    console.log(this.selectedQuiz);
  };

  addNewQuiz = () => {
    const newQuiz = {
      quizName: 'Untitled Quiz',
      quizQuestions: [],
      markedForDelete: false,
    };

    this.quizzes = [...this.quizzes, newQuiz];

    this.selectQuiz(newQuiz);
  };

  addNewQuestion = () => {
    if (this.selectedQuiz) {
      this.selectedQuiz.quizQuestions = [
        ...this.selectedQuiz.quizQuestions,
        {
          questionName: 'Untitled Question',
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

  // promise method 1 (bad)
  jsPromisesOne = () => {
    const n = this.quizSvc.getMagicNumber(true);
    console.log(n); // returns a promise

    // then when the promise is returned, we can dive in to get the value
    n.then((number) => {
      console.log(number);

      // to get a second magic number:
      const n2 = this.quizSvc.getMagicNumber(true);
      console.log(n2);
      n2.then((x) => console.log(x)).catch((e) => console.error(e));
    }).catch((err) => {
      console.error(err);
    });
  };

  // promise method 2 (better practice)
  jsPromisesTwo = async () => {
    try {
      const x = await this.quizSvc.getMagicNumber(true);
      console.log(x);

      const y = await this.quizSvc.getMagicNumber(true);
      console.log(y);
    } catch (err) {
      console.error(err);
    }
  };

  // promise method 2 (another async/await approach)
  jsPromisesThree = async () => {
    try {
      // removed await
      const x = this.quizSvc.getMagicNumber(true);
      console.log(x);

      // removed await
      const y = this.quizSvc.getMagicNumber(true);
      console.log(y);

      // start two async calls at the same time
      const results = await Promise.all([x, y]);
      console.log(results); // returns all results as array

      // or start promises at the same time but only wait for the quickest response
      //const results = await Promise.race([x, y]);
      //console.log(results); // returns single number
    } catch (err) {
      console.error(err);
    }
  };
}
